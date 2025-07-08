import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  Package, User, CreditCard, MapPin, IndianRupee, Tickets,
  Headset, FileText, CircleHelp as HelpCircle, Users, LayoutDashboard,
  BookOpen, Globe, Truck, Bell
} from 'lucide-react-native';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const bannerWidth = screenWidth;
  const promoCardHeight = 60;

  const quickServices = [
    { label: 'Packages', icon: Package, color: '#008000' },
    { label: 'COD Account', icon: CreditCard, color: '#006400' },
    { label: 'Nearby Branch', icon: MapPin, color: '#38B000' },
    { label: 'Phone Book', icon: User, color: '#007200' },
  ];

  const shippingPromos = [
    {
      title: 'Go to international shipping', subtitle: 'Expand your business globally',
      button: 'Ship Now', icon: Globe, iconColor: '#008000',
      bgColor: 'bg-green-50', btnColor: 'bg-green-600',
    },
    {
      title: 'Express Delivery', subtitle: 'Fastest delivery worldwide',
      button: 'Express Now', icon: Truck, iconColor: '#38B000',
      bgColor: 'bg-green-100', btnColor: 'bg-green-700',
    },
    {
      title: 'Bulk Shipping', subtitle: 'Save more on large shipments',
      button: 'Bulk Ship', icon: Package, iconColor: '#007200',
      bgColor: 'bg-green-200', btnColor: 'bg-green-800',
    },
  ];
  const promoList = [...shippingPromos, shippingPromos[0]];

  const promoBanners = [
    { image: 'https://pickndropnepal.com/files/mobile_ads_design_1.png' },
    { image: 'https://pickndropnepal.com/files/ads_mobile_1.png' },
  ];

  const operations = [
    { label: 'Shipping Rate', icon: IndianRupee },
    { label: 'Ticket', icon: Tickets },
    { label: 'Call Center', icon: Headset },
    { label: 'Billing Info', icon: FileText },
    { label: 'FAQ', icon: HelpCircle },
    { label: 'Manual', icon: Users },
    { label: 'Guidelines', icon: BookOpen },
    { label: 'Dashboard', icon: LayoutDashboard },
  ];

  const scrollRef = useRef(null);
  const promoScrollRef = useRef(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentPromo, setCurrentPromo] = useState(0);

  // Auto-scroll banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev === promoBanners.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: currentBanner * bannerWidth, animated: true });
    }
  }, [currentBanner]);

  // Auto-scroll promos
  useEffect(() => {
    const interval = setInterval(() => setCurrentPromo((prev) => prev + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (promoScrollRef.current) {
      promoScrollRef.current.scrollTo({ y: currentPromo * promoCardHeight, animated: true });
    }
    if (currentPromo === shippingPromos.length) {
      setTimeout(() => {
        promoScrollRef.current?.scrollTo({ y: 0, animated: false });
        setCurrentPromo(0);
      }, 300);
    }
  }, [currentPromo]);

  // If user logs in, redirect to main tabs
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-green-50">
        <Text className="text-green-800 text-lg">Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <ScrollView className="flex-1 bg-green-50">
        {/* Header */}
        <View className="bg-green-600 px-6 pt-12 pb-5 rounded-b-3xl">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text className="text-sm text-white/80 mb-1">Welcome back,</Text>
              <Text className="text-xl font-bold text-white mb-1">Guest !</Text>
            </View>
            <TouchableOpacity className="p-2.5">
              <Bell size={25} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 pt-3 pb-2">
          {/* Promo banners */}
          <View className="mb-6">
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={{ width: bannerWidth, height: 128 }}
            >
              {promoBanners.map((banner, idx) => (
                <View key={idx} style={{ width: bannerWidth, height: 128, paddingRight: 30 }}>
                  <View style={{ flex: 1, borderRadius: 16, overflow: 'hidden' }}>
                    <Image source={{ uri: banner.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  </View>
                </View>
              ))}
            </ScrollView>
            <View className="flex-row justify-center mt-2">
              {promoBanners.map((_, idx) => (
                <View key={idx} className="mx-1 rounded-full"
                  style={{ width: 8, height: 8, backgroundColor: idx === currentBanner ? '#008000' : '#d1d5db' }} />
              ))}
            </View>
          </View>

          {/* Shipping promos */}
          <View className="mb-6" style={{ height: promoCardHeight }}>
            <ScrollView
              ref={promoScrollRef}
              pagingEnabled
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              style={{ height: promoCardHeight }}
            >
              {promoList.map((promo, idx) => (
                <TouchableOpacity
                  key={idx}
                  className="bg-white rounded-2xl p-2 shadow-sm"
                  style={{ height: promoCardHeight }}
                  onPress={() => router.push('/login')}
                >
                  <View className="flex-row items-center">
                    <View className={`${promo.bgColor} rounded-xl p-2 mr-3`}>
                      <promo.icon size={18} color={promo.iconColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-gray-800">{promo.title}</Text>
                      <Text className="text-xs text-gray-600">{promo.subtitle}</Text>
                    </View>
                    <View className={`${promo.btnColor} rounded-xl px-3 py-1.5`}>
                      <Text className="text-white font-semibold text-xs">{promo.button}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quick Services */}
          <View className="mb-3">
            <Text className="text-md font-semibold text-gray-800 mb-3">Quick Services</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 8 }}>
              {quickServices.map((service, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-white rounded-2xl p-2.5 items-center shadow-sm"
                  style={{ width: 90 }}
                  onPress={() => router.push('/login')}
                >
                  <View className="rounded-xl w-8 h-8 justify-center items-center mb-2" style={{ backgroundColor: service.color }}>
                    <service.icon size={16} color="white" />
                  </View>
                  <Text className="text-xs text-gray-800 text-center" numberOfLines={2}>{service.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* My Operations */}
          <View className="mb-6">
            <Text className="text-md font-semibold text-gray-800 mb-3">My Operations</Text>
            <View className="bg-white p-3 rounded-xl shadow-sm">
              <View className="flex-row flex-wrap justify-between">
                {operations.map((operation, index) => (
                  <TouchableOpacity
                    key={index}
                    className="p-2 w-[25%] mb-2 items-center"
                    onPress={() => router.push('/login')}
                  >
                    <View className="rounded-lg w-6 h-6 justify-center items-center mb-1">
                      <operation.icon size={18} color="black" />
                    </View>
                    <Text className="text-xs text-gray-800 text-center" numberOfLines={2}>{operation.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return null;
}
