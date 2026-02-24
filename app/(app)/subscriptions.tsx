import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../../src/store/authStore';
import {
  useUserPlan,
  useUserPayments,
  useActivatePremium,
  useCancelPremium,
} from '../../src/hooks/useUser';
import ErrorState from '../../src/components/ui/ErrorState';
import { formatDate } from '../../src/utils/formatters';
import type { Pago } from '../../src/types/api.types';

const PREMIUM_FEATURES = [
  { icon: 'download-outline' as const, text: 'Descarga canciones sin conexión' },
  { icon: 'musical-notes-outline' as const, text: 'Audio de máxima calidad' },
  { icon: 'ban-outline' as const, text: 'Sin anuncios' },
  { icon: 'shuffle-outline' as const, text: 'Escucha en cualquier orden' },
];

const SubscriptionsScreen = () => {
  const userId = useAuthStore((s) => s.userId);
  const { data: plan, isLoading: planLoading, isError: planError, refetch } = useUserPlan(userId);
  const { data: payments, isLoading: paymentsLoading } = useUserPayments(userId);
  const activateMutation = useActivatePremium(userId);
  const cancelMutation = useCancelPremium(userId);

  const isPremium = plan?.tipo === 'premium';

  const handleActivatePremium = () => {
    Alert.alert(
      'Activar Premium',
      '¿Quieres activar el plan Premium por 9,99 €/mes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Activar',
          onPress: () =>
            activateMutation.mutate(undefined, {
              onSuccess: () => Alert.alert('¡Listo!', 'Plan Premium activado correctamente'),
              onError: () => Alert.alert('Error', 'No se pudo activar Premium'),
            }),
        },
      ]
    );
  };

  const handleCancelPremium = () => {
    Alert.alert(
      'Cancelar Premium',
      '¿Seguro que quieres volver al plan gratuito? Perderás las funciones Premium.',
      [
        { text: 'Mantener Premium', style: 'cancel' },
        {
          text: 'Cancelar Premium',
          style: 'destructive',
          onPress: () =>
            cancelMutation.mutate(undefined, {
              onSuccess: () =>
                Alert.alert('Plan cambiado', 'Has vuelto al plan gratuito'),
              onError: () =>
                Alert.alert('Error', 'No se pudo cancelar el plan Premium'),
            }),
        },
      ]
    );
  };

  if (planLoading) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>
    );
  }

  if (planError) {
    return (
      <SafeAreaView className="flex-1 bg-spotify-black">
        <ErrorState message="No se pudo cargar la suscripción" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-spotify-black">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row items-center px-4 pt-2 pb-4">
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-4">Suscripción</Text>
        </View>

        {/* Plan card */}
        <View className="mx-4 rounded-2xl overflow-hidden mb-6">
          <LinearGradient
            colors={isPremium ? ['#7B2FBE', '#4B1A72'] : ['#333', '#1a1a1a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 24, borderRadius: 16 }}
          >
            <View className="flex-row items-center mb-3">
              <Ionicons
                name={isPremium ? 'star' : 'musical-notes'}
                size={32}
                color={isPremium ? '#FFD700' : '#B3B3B3'}
              />
              <View className="ml-3">
                <Text className="text-white text-xl font-bold">
                  Spotify {isPremium ? 'Premium' : 'Free'}
                </Text>
                <Text className="text-white/70 text-sm">
                  {isPremium ? '9,99 €/mes' : 'Gratis con anuncios'}
                </Text>
              </View>
            </View>

            {isPremium && plan?.fechaRenovacion && (
              <View className="bg-white/10 rounded-lg px-3 py-2 mt-2 mb-3">
                <Text className="text-white/80 text-xs">
                  Próxima renovación: {formatDate(plan.fechaRenovacion)}
                </Text>
              </View>
            )}

            {!isPremium && plan?.fechaRevision && (
              <View className="bg-white/10 rounded-lg px-3 py-2 mt-2 mb-3">
                <Text className="text-white/80 text-xs">
                  Miembro desde: {formatDate(plan.fechaRevision)}
                </Text>
              </View>
            )}

            {!isPremium ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleActivatePremium}
                disabled={activateMutation.isPending}
                className="bg-white rounded-full py-3 items-center mt-2"
              >
                {activateMutation.isPending ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text className="text-black text-base font-bold">Hazte Premium</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCancelPremium}
                disabled={cancelMutation.isPending}
                className="border border-white/40 rounded-full py-3 items-center mt-2"
              >
                {cancelMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-sm font-semibold">Cancelar suscripción</Text>
                )}
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>

        {/* Premium features */}
        {!isPremium && (
          <View className="mx-4 mb-6">
            <Text className="text-white text-lg font-bold mb-3">¿Por qué Premium?</Text>
            {PREMIUM_FEATURES.map((feat) => (
              <View key={feat.text} className="flex-row items-center py-2.5">
                <View className="w-9 h-9 rounded-full bg-spotify-green/20 items-center justify-center">
                  <Ionicons name={feat.icon} size={18} color="#1DB954" />
                </View>
                <Text className="text-white text-sm ml-3 flex-1">{feat.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Historial de pagos */}
        <View className="px-4">
          <Text className="text-white text-lg font-bold mb-3">Historial de pagos</Text>

          {paymentsLoading && <ActivityIndicator color="#1DB954" className="mt-4" />}

          {!paymentsLoading && (!payments || payments.length === 0) && (
            <View className="bg-spotify-dark rounded-xl items-center py-8 px-4">
              <Ionicons name="receipt-outline" size={40} color="#535353" />
              <Text className="text-spotify-gray text-sm mt-3 text-center">
                No hay pagos registrados
              </Text>
            </View>
          )}

          {payments && payments.length > 0 && (
            <View className="bg-spotify-dark rounded-xl overflow-hidden">
              {payments.map((payment: Pago, index: number) => (
                <View
                  key={payment.numeroOrden}
                  className={`flex-row items-center px-4 py-3.5 ${
                    index < payments.length - 1 ? 'border-b border-spotify-darker' : ''
                  }`}
                >
                  <View className="w-10 h-10 rounded-full bg-spotify-green/10 items-center justify-center">
                    <Ionicons name="checkmark-circle" size={20} color="#1DB954" />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-white text-sm font-semibold">
                      Pago Premium
                    </Text>
                    <Text className="text-spotify-gray text-xs mt-0.5">
                      Orden #{payment.numeroOrden}
                    </Text>
                  </View>
                  <Text className="text-spotify-gray text-xs">
                    {formatDate(payment.fecha)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionsScreen;
