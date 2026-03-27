import "@/global.css"
import {FlatList, Image, Pressable, Text, View} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import {HOME_BALANCE} from "@/constants/data";
import {icons} from "@/constants/icons";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import {useState, useMemo} from "react";
import { useUser } from '@clerk/expo';
import { usePostHog } from 'posthog-react-native';
import { useSubscriptionStore } from "@/lib/subscriptionStore";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
    const { user } = useUser();
    const posthog = usePostHog();
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { subscriptions, addSubscription } = useSubscriptionStore();

    // Get upcoming subscriptions (active subscriptions with renewal date within next 7 days)
    const upcomingSubscriptions = useMemo(() => {
        const now = dayjs();
        const nextWeek = now.add(7, 'days');
        return subscriptions.filter(sub =>
            sub.status === 'active' &&
            dayjs(sub.renewalDate).isAfter(now) &&
            dayjs(sub.renewalDate).isBefore(nextWeek)
        ).sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)));
    }, [subscriptions]);

    const handleSubscriptionPress = (item: Subscription) => {
        const isExpanding = expandedSubscriptionId !== item.id;
        setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id));
        posthog.capture(isExpanding ? 'subscription_expanded' : 'subscription_collapsed', {
            subscription_name: item.name,
            subscription_id: item.id,
        });
    };

    const handleCreateSubscription = (newSubscription: Subscription) => {
        addSubscription(newSubscription);
        posthog.capture('subscription_created', {
            subscription_name: newSubscription.name,
            subscription_price: newSubscription.price,
            subscription_frequency: newSubscription.frequency,
            subscription_category: newSubscription.category,
        });
    };

    // Get user display name: firstName, fullName, or email
    const displayName = user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User';

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
                <FlatList
                    ListHeaderComponent={() => (
                        <>
                            <View className="home-header">
                                <View className="home-user">
                                    <Image
                                        source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                                        className="home-avatar"
                                    />
                                    <Text className="home-user-name">{displayName}</Text>
                                </View>

                                <Pressable onPress={() => setIsModalVisible(true)}>
                                    <Image source={icons.add} className="home-add-icon" />
                                </Pressable>
                            </View>

                            <View className="home-balance-card">
                                <Text className="home-balance-label">Balance</Text>

                                <View className="home-balance-row">
                                    <Text className="home-balance-amount">
                                        {formatCurrency(HOME_BALANCE.amount)}
                                    </Text>
                                    <Text className="home-balance-date">
                                        {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                                    </Text>
                                </View>
                            </View>

                            <View className="mb-5">
                                <ListHeading title="Upcoming" />

                                <FlatList
                                    data={upcomingSubscriptions}
                                    renderItem={({ item }) => (<UpcomingSubscriptionCard {...item} />)}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet.</Text>}
                                />
                            </View>

                            <ListHeading title="All Subscriptions" />
                        </>
                    )}
                    data={subscriptions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <SubscriptionCard
                            {...item}
                            expanded={expandedSubscriptionId === item.id}
                            onPress={() => handleSubscriptionPress(item)}
                        />
                    )}
                    extraData={expandedSubscriptionId}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet.</Text>}
                    contentContainerClassName="pb-30"
                />

            <CreateSubscriptionModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleCreateSubscription}
            />
        </SafeAreaView>
    );
}
