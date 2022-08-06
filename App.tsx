import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import {spline} from '@georgedoescode/spline';
import {
  Canvas,
  LinearGradient,
  Path,
  useClockValue,
  useComputedValue,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import {createNoise2D} from 'simplex-noise';

const App = () => {
  const points = useValue(createPoints());

  function createPoints() {
    const points = [];
    const numPoints = 6;
    const angleStep = (Math.PI * 2) / numPoints;
    const rad = 110;

    for (let i = 1; i <= numPoints; i++) {
      const theta = i * angleStep;

      const x = 130 + Math.cos(theta) * rad;
      const y = 130 + Math.sin(theta) * rad;

      // store the point
      points.push({
        x: x,
        y: y,
        originX: x,
        originY: y,
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
      });
    }

    return points;
  }

  const path = useComputedValue(() => {
    return spline(points.current, 1, true);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Canvas style={styles.canvas}>
        <Path path={path} />
      </Canvas>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    height: 275,
    width: 275,
  },
});

export default App;
