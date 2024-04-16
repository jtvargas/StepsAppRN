import {useEffect, useState} from 'react';
import HealthKit, {IHealthKit} from '@app/utils/HealthKit';

const useHealthKit = () => {
  const [healthKit, setHealthKit] = useState<IHealthKit | undefined>(undefined);
  const [stepsCount, setStepsCount] = useState(0);
  const [walkingDistance, setWalkingDistance] = useState(0);
  const [error, setError] = useState('');
  const hk = new HealthKit();

  useEffect(() => {
    const unsubscribe = hk.subscribe(() => {
      setHealthKit(hk);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (healthKit?.isAvailable) {
      getSteps();
      getDistanceWalking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [healthKit?.isAvailable]);

  const getSteps = async () => {
    if (healthKit && healthKit.isAvailable) {
      const stepsCountValue = await healthKit.getStepsCount();

      setStepsCount(stepsCountValue);
    } else {
      setError('HealthKit is not available.');
    }
  };

  const getDistanceWalking = async () => {
    if (healthKit && healthKit.isAvailable) {
      const distanceValue = await healthKit.getDistanceWalking();

      setWalkingDistance(distanceValue);
    } else {
      setError('HealthKit is not available.');
    }
  };

  const refreshData = async () => {
    try {
      await getDistanceWalking();
      await getSteps();
    } catch (e) {
      console.log('ERROR refresh data', e);
    }
  };

  return {
    stepsCount,
    walkingDistance,
    error,
    refreshData,
    isAvailable: healthKit?.isAvailable,
  };
};

export default useHealthKit;
