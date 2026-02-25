import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface ShimmerProps {
  width: number;
  height: number;
  borderRadius?: number;
}

// Componente base con animacion de opacidad pulsante
const Shimmer: React.FC<ShimmerProps> = ({ width, height, borderRadius = 8 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#282828',
        opacity,
      }}
    />
  );
};

// Placeholder con forma de card horizontal (150x180)
export const ShimmerCard: React.FC = () => {
  return (
    <View style={{ width: 150, marginRight: 12 }}>
      <Shimmer width={150} height={150} borderRadius={8} />
      <View style={{ marginTop: 8 }}>
        <Shimmer width={120} height={12} borderRadius={4} />
      </View>
      <View style={{ marginTop: 6 }}>
        <Shimmer width={80} height={10} borderRadius={4} />
      </View>
    </View>
  );
};

// Placeholder con forma de fila (ancho completo x 72)
export const ShimmerRow: React.FC = () => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
      <Shimmer width={48} height={48} borderRadius={4} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Shimmer width={160} height={14} borderRadius={4} />
        <View style={{ marginTop: 6 }}>
          <Shimmer width={100} height={10} borderRadius={4} />
        </View>
      </View>
    </View>
  );
};

export default Shimmer;
