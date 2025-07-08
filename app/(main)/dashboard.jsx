import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import {
  IndianRupee,
  Tickets,
  Headset,
  FileText,
  CircleHelp as HelpCircle,
  Users,
  BookOpen,
  LayoutDashboard,
} from 'lucide-react-native';

const groupedOperations = [
  {
    title: 'Account',
    data: [
      { label: 'Billing Info', icon: FileText, color: '#006400' },
      { label: 'Manual', icon: Users, color: '#70E000' },
    ],
  },
  {
    title: 'Operation',
    data: [
      { label: 'Shipping Rate', icon: IndianRupee, color: '#70E000' },
      { label: 'Ticket', icon: Tickets, color: '#38B000' },
      { label: 'Call Center', icon: Headset, color: '#008000' },  
      ],
  },
  {
    title: 'Others',
    data: [
      { label: 'FAQ', icon: HelpCircle, color: '#38B000' },
      { label: 'Guidelines', icon: BookOpen, color: '#008000' },
    ],
  },
];

export default function Dashboard() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView className="flex-1 p-4">
        <Text className="text-xl font-bold mb-4">My Operations</Text>
        {groupedOperations.map((group, gIdx) => (
          <View key={gIdx} className="mb-6">
            <Text className="text-lg font-semibold mb-2 text-gray-700">{group.title}</Text>
            {group.data.map((operation, idx) => (
              <TouchableOpacity
                key={idx}
                className="flex-row items-center bg-gray-50 rounded-xl p-3 mb-2"
              >
                <View
                  className="rounded-lg w-8 h-8 justify-center items-center mr-3"
                  style={{ backgroundColor: operation.color + '20' }}
                >
                  <operation.icon size={22} color={operation.color} />
                </View>
                <Text className="text-base text-gray-800">{operation.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}