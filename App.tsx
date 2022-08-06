import {
  Canvas,
  Path,
  useClockValue,
  useComputedValue,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

import {spline} from '@georgedoescode/spline';
import {createNoise2D} from 'simplex-noise';

const App = () => {
  const noise = createNoise2D();
  const noiseStep = 0.005;
  const clock = useClockValue();

  const createPoints = () => {
    const newPoints = [];
    const numPoints = 6;
    const angleStep = (Math.PI * 2) / numPoints;
    const rad = 110;

    for (let i = 1; i <= numPoints; i++) {
      const theta = i * angleStep;
      const x = 130 + Math.cos(theta) * rad;
      const y = 130 + Math.sin(theta) * rad;

      newPoints.push({
        x,
        y,
        originX: x,
        originY: y,
        noiseOffsetX: x,
        noiseOffsetY: y,
      });
    }

    return newPoints;
  };

  const mapNumbers = (
    n: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ) => {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
  };

  const animate = () => {
    const newPoints = [];

    for (let i = 0; i < points.current.length; i++) {
      const point = points.current[i];

      const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
      const nY = noise(point.noiseOffsetY, point.noiseOffsetY);
      const x = mapNumbers(nX, -1, 1, point.originX - 20, point.originX + 20);
      const y = mapNumbers(nY, -1, 1, point.originY - 20, point.originY + 20);

      point.x = x;
      point.y = y;

      point.noiseOffsetX += noiseStep;
      point.noiseOffsetY += noiseStep;

      newPoints.push(point);
    }

    points.current = newPoints;
  };

  const points = useValue(createPoints());

  const path = useComputedValue(() => {
    animate();
    return spline(points.current, 1, true);
  }, [clock]);

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
