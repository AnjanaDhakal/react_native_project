import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  DollarSign,
  Package,
  User,
  ShoppingCart,
  Headset,
  IndianRupee,
  Bell,
  QrCode,
  FileText,
  Users,
  MapPin,
  LayoutDashboard,
  CircleHelp as HelpCircle,
  ChartBar as BarChart3,
  CreditCard,
  Truck,
  Tickets,
  Globe,
  BookOpen,
} from 'lucide-react-native';
import React, { useRef, useEffect, useState } from 'react';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useOrders, useProducts } from '@/context/StoreContext';
import SyncIndicator from '@/components/SyncIndicator';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const orders = useOrders(user?.id);
  const products = useProducts(user?.id);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      return () => StatusBar.setBarStyle('dark-content'); // reset on blur
    }, [])
  );


  const screenWidth = Dimensions.get('window').width;

  const quickServices = [
    {
      label: 'Packages',
      icon: Package,
      color: '#008000',
      subtitle: 'Ship One Per Time',
      route: '/orders', // update with your route
    },
    {
      label: 'COD Account',
      icon: CreditCard,
      color: '#006400',
      subtitle: 'Cash on Delivery',
      route: '/cod-account', // update with your route
    },
    {
      label: 'Nearby Branch',
      icon: MapPin,
      color: '#38B000',
      subtitle: 'Bulk Parcel Shipping',
      route: '/branch', // update with your route
    },
    {
      label: 'Phone Book',
      icon: User,
      color: '#007200',
      subtitle: 'Get Price Quote',
      route: '/customer', // update with your route
    },
    {
      label: 'Phone Book',
      icon: User,
      color: '#007200',
      subtitle: 'Get Price Quote',
      route: '/customer', // update with your route
    },
  ];

  const shippingPromos = [
    {
      title: 'Go to international shipping',
      subtitle: 'Expand your business globally',
      button: 'Ship Now',
      icon: Globe,
      iconColor: '#008000',
      bgColor: 'bg-green-50',
      btnColor: 'bg-green-600',
      url: 'https://your-international-shipping-url.com',
    },
    {
      title: 'Express Delivery',
      subtitle: 'Fastest delivery worldwide',
      button: 'Express Now',
      icon: Truck,
      iconColor: '#38B000',
      bgColor: 'bg-green-100',
      btnColor: 'bg-green-700',
      url: 'https://your-express-delivery-url.com',
    },
    {
      title: 'Bulk Shipping',
      subtitle: 'Save more on large shipments',
      button: 'Bulk Ship',
      icon: Package,
      iconColor: '#007200',
      bgColor: 'bg-green-200',
      btnColor: 'bg-green-800',
      url: 'https://your-bulk-shipping-url.com',
    },
  ];

  const promoCardHeight = 60;
  const promoScrollRef = useRef(null);
  const [currentPromo, setCurrentPromo] = useState(0);

  // The list with extra clone
  const promoList = [...shippingPromos, shippingPromos[0]];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (promoScrollRef.current) {
      promoScrollRef.current.scrollTo({
        y: currentPromo * promoCardHeight,
        animated: true,
      });
    }

    if (currentPromo === shippingPromos.length) {
      // we reached the fake last item
      setTimeout(() => {
        if (promoScrollRef.current) {
          promoScrollRef.current.scrollTo({ y: 0, animated: false });
        }
        setCurrentPromo(0);
      }, 300); // wait for smooth scroll to finish
    }
  }, [currentPromo]);

  const operations = [
    { label: 'Shipping Rate', icon: IndianRupee, color: '#70E000' },
    { label: 'Ticket', icon: Tickets, color: '#38B000' },
    { label: 'Call Center', icon: Headset, color: '#008000' },
    { label: 'Billing Info', icon: FileText, color: '#006400' },
    { label: 'FAQ', icon: HelpCircle, color: '#38B000' },
    { label: 'Manual', icon: Users, color: '#70E000' },
    { label: 'Guidelines', icon: BookOpen, color: '#008000' },
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: '#007200',
      route: '/dashboard',
    },
  ];

  // banner size = 800:533
  const promoBanners = [
    {
      title: '',
      subtitle: '',
      image: 'https://pickndropnepal.com/files/mobile_ads_design_1.png',
      button: '',
    },
    {
      title: '',
      subtitle: '',
      image: 'https://pickndropnepal.com/files/ads_mobile_1.png',
      button: '',
    },
  ];

  const scrollRef = useRef(null);
  const chartScrollRef = useRef(null);

  const bannerWidth = screenWidth;
  const chartWidth = screenWidth - 48;

  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentChart, setCurrentChart] = useState(0);

  // Auto-scroll banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === promoBanners.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [promoBanners.length]);

  // Scroll to active banner
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: currentBanner * bannerWidth,
        animated: true,
      });
    }
  }, [currentBanner, bannerWidth]);

  // Auto-scroll charts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChart((prev) => (prev === 1 ? 0 : prev + 1));
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to active chart
  useEffect(() => {
    if (chartScrollRef.current) {
      chartScrollRef.current.scrollTo({
        x: currentChart * chartWidth,
        animated: true,
      });
    }
  }, [currentChart, chartWidth]);

  // Example data: last 7 days stats
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: orders.length > 0 ? [20, 25, 18, 22, 30, 28, orders.length] : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(34, 139, 230, ${opacity})`, // blue
        strokeWidth: 2,
      },
      {
        data: orders.length > 0 ? [18, 23, 17, 20, 27, 26, orders.filter(o => o.status === 'Completed').length] : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // green
        strokeWidth: 2,
      },
      {
        data: orders.length > 0 ? [2, 2, 1, 2, 3, 2, orders.filter(o => o.status === 'Cancelled').length] : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // soft red
        strokeWidth: 2,
      },
    ],
    legend: ['Total Orders', 'Delivered', 'RTV'],
  };

  const pieData = [
    {
      name: 'RTV',
      population: orders.filter(o => o.status === 'Cancelled').length || 1,
      color: 'gray',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Delivered',
      population: orders.filter(o => o.status === 'Completed').length || 9,
      color: '#38B000',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-green-50">
      {/* Header Section */}
      <View className="bg-green-600 px-6 pt-12 pb-5 rounded-b-3xl">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-sm text-white/80 mb-1">Welcome back,</Text>
            <Text className="text-xl font-bold text-white mb-1">
              {user?.name}!
            </Text>
            <SyncIndicator />
          </View>
          <TouchableOpacity className="relative rounded-xl p-2.5">
            <Bell size={25} color="white" />
            <View
              className="absolute rounded-full w-5 h-5 bg-green-300 justify-center items-center"
              style={{ top: -4, right: -4 }}
            >
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-1 shadow-sm">
          <Search className="mr-3" size={18} color="#6b7280" />
          <TextInput
            className="flex-1 text-sm text-gray-800"
            placeholder="Search or track a parcel"
            placeholderTextColor="#6b7280"
          />
          <TouchableOpacity
            onPress={() => router.push('/scanner')}
            className="bg-green-50 rounded-lg p-1.5"
          >
            <QrCode size={18} color="#008000" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 pt-3 pb-2">
        {/* Quick Stats Graph */}
        <View className="mb-6">
          <Text className="text-md font-semibold text-gray-800 mb-3">
            Overview
          </Text>
          <View className="mb-3">
            <ScrollView
              ref={chartScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {[
                <View key="line" style={{ width: chartWidth, marginRight: 24 }}>
                  <Text className="text-xs  text-gray-800 mb-2">
                    Weekly Orders Trend
                  </Text>
                  <LineChart
                    data={chartData}
                    width={chartWidth}
                    height={220}
                    chartConfig={{
                      backgroundColor: '#fff',
                      backgroundGradientFrom: '#fff',
                      backgroundGradientTo: '#fff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(55, 65, 81, ${opacity})`,
                      style: { borderRadius: 16 },
                      propsForDots: {
                        r: '4',
                        strokeWidth: '2',
                        stroke: '#fff',
                      },
                      propsForBackgroundLines: { stroke: '#e5e7eb' },
                    }}
                    bezier
                    style={{ borderRadius: 16 }}
                  />
                </View>,
                <View key="pie" style={{ width: chartWidth }}>
                  <Text className="text-xs  text-gray-800 mb-2">
                    Delivery Breakdown
                  </Text>
                  <PieChart
                    data={pieData}
                    width={chartWidth}
                    height={200}
                    chartConfig={{
                      backgroundColor: '#fff',
                      backgroundGradientFrom: '#fff',
                      backgroundGradientTo: '#fff',
                      color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="#fff"
                    paddingLeft="30"
                    absolute
                    style={{
                      borderRadius: 16,
                      backgroundColor: '#fff',
                      marginTop: 10,
                    }}
                  />
                </View>,
              ].map((chart, idx) => (
                <View
                  key={idx}
                  style={{ width: chartWidth, marginRight: idx !== 1 ? 24 : 0 }}
                >
                  {chart}
                </View>
              ))}
            </ScrollView>
            {/* dots */}
            <View className="flex-row justify-center mt-2">
              {[0, 1].map((idx) => (
                <View
                  key={idx}
                  className="mx-1 rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor:
                      idx === currentChart ? '#008000' : '#d1d5db',
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* International Shipping Promotion */}
        <View className="mb-6" style={{ height: 60 }}>
          <ScrollView
            ref={promoScrollRef}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            style={{ height: promoCardHeight }}
          >
            {promoList.map((promo, idx) => (
              <TouchableOpacity
                key={idx}
                className="bg-white rounded-2xl p-2 shadow-sm"
                style={{ height: promoCardHeight }}
                onPress={() => {
                  // if (promo.url) {
                  //   Linking.openURL(promo.url);
                  // }
                  if (promo.url) {
                    WebBrowser.openBrowserAsync(promo.url);
                  }
                }}
              >
                <View className="flex-row items-center">
                  <View className={`${promo.bgColor} rounded-xl p-2 mr-3`}>
                    <promo.icon size={18} color={promo.iconColor} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-800 mb-0.5">
                      {promo.title}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      {promo.subtitle}
                    </Text>
                  </View>
                  <View className={`${promo.btnColor} rounded-xl px-3 py-1.5`}>
                    <Text className="text-white font-semibold text-xs">
                      {promo.button}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

       
        {/* Quick Services - Horizontal Scroll */}
        <View className="mb-3">
          <Text className="text-md font-semibold text-gray-800 mb-3">
            Quick Services
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 8 }}
          >
            {quickServices.map((service, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl p-2.5 items-center shadow-sm"
                style={{ width: 90 }}
                onPress={() => router.push(service.route)}
              >
                <View
                  className="rounded-xl w-8 h-8 justify-center items-center mb-2"
                  style={{ backgroundColor: service.color }}
                >
                  <service.icon size={16} color="white" />
                </View>
                <Text
                  className="text-xs text-gray-800 text-center"
                  numberOfLines={2}
                >
                  {service.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Promotional Banner */}

        <View className="mb-6">
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{
              width: bannerWidth,
              height: 128,
            }}
          >
            {promoBanners.map((banner, idx) => (
              <View
                key={idx}
                style={{
                  width: bannerWidth,
                  height: 128,
                  paddingRight: 30,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={{ uri: banner.image }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  {(banner.title || banner.subtitle || banner.button) && (
                    <View className="absolute inset-0 bg-green-600/80 justify-center items-center">
                      {banner.title ? (
                        <Text className="text-xl font-bold text-white mb-1">
                          {banner.title}
                        </Text>
                      ) : null}
                      {banner.subtitle ? (
                        <Text className="text-sm text-white/90 mb-3 text-center">
                          {banner.subtitle}
                        </Text>
                      ) : null}
                      {banner.button ? (
                        <TouchableOpacity className="bg-white rounded-xl px-4 py-2">
                          <Text className="text-green-600 font-semibold text-sm">
                            {banner.button}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
          {/* dots */}
          <View className="flex-row justify-center mt-2">
            {promoBanners.map((_, idx) => (
              <View
                key={idx}
                className="mx-1 rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor:
                    idx === currentBanner ? '#008000' : '#d1d5db',
                }}
              />
            ))}
          </View>
        </View>

        {/* My Operations */}

        <View className="mb-6">
          <Text className="text-md font-semibold text-gray-800 mb-3">
            My Operations
          </Text>
          <View className="bg-white p-3 rounded-xl shadow-sm">
            <View className="flex-row flex-wrap justify-between ">
              {operations.map((operation, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-white  p-2 w-[25%] mb-2 items-center "
                  onPress={() => {
                    if (operation.route) {
                      router.push(operation.route);
                    }
                  }}
                >
                  <View className="rounded-lg w-6 h-6 justify-center items-center mb-1">
                    <operation.icon size={18} color="black" />
                  </View>
                  <Text
                    className="text-xs text-gray-800 text-center"
                    numberOfLines={2}
                  >
                    {operation.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-800 mb-3">
            Recent Activity
          </Text>
          <View className="bg-white rounded-2xl p-3 shadow-sm">
            {orders.length === 0 ? (
              <View className="py-8 items-center">
                <Package size={32} color="#9ca3af" />
                <Text className="text-gray-500 mt-2 text-center">No recent activity</Text>
                <Text className="text-gray-400 text-sm text-center">Your orders and updates will appear here</Text>
              </View>
            ) : (
            <>
            <View className="flex-row py-2">
              <View className="bg-green-50 rounded-lg w-7 h-7 justify-center items-center mr-3">
                <ShoppingCart size={14} color="#008000" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800 mb-0.5">
                  Your pickup request has been accepted.
                </Text>
                <Text className="text-xs text-gray-600 mb-0.5">
                  Hari Shrestha #9865252525
                </Text>
                <Text className="text-xs text-green-600">2 hours ago</Text>
              </View>
            </View>
            <View className="flex-row py-2 border-t border-b border-gray-100">
              <View className="bg-green-50 rounded-lg w-7 h-7 justify-center items-center mr-3">
                <Package size={14} color="#38B000" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800 mb-0.5">
                  Order #{orders[0]?.id?.slice(-4) || '213'} has been successfully delivered.
                </Text>
                <Text className="text-xs text-gray-600 mb-0.5">Learn more</Text>
                <Text className="text-xs text-green-600">4 hours ago</Text>
              </View>
            </View>
            <View className="flex-row py-2">
              <View className="bg-green-50 rounded-lg w-7 h-7 justify-center items-center mr-3">
                <DollarSign size={14} color="#007200" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800 mb-0.5">
                  Payment received
                </Text>
                <Text className="text-xs text-gray-600 mb-0.5">
                  ${orders.find(o => o.status === 'Completed')?.amount?.toFixed(2) || '156.50'} has been settled.
                </Text>
                <Text className="text-xs text-green-600">6 hours ago</Text>
              </View>
            </View>
            </>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
