import HealthKit from '@app/utils/HealthKit';
import {Platform} from 'react-native';
import {
  initHealthKitIOS,
  getTodayStepsCountIOS,
  getDistanceWalkingIOS,
} from '@app/utils/HealthKit/ios';
import {
  initHealthKitForAndroid,
  getStepsCountAndroid,
  getDistanceWalkingAndroid,
} from '@app/utils/HealthKit/android';

jest.mock('react-native', () => ({
  Platform: {
    select: jest.fn(),
  },
}));

// Mock the iOS and Android module functions
jest.mock('@app/utils/HealthKit/ios', () => ({
  initHealthKitIOS: jest.fn(),
  getTodayStepsCountIOS: jest.fn(),
  getDistanceWalkingIOS: jest.fn(),
}));

jest.mock('@app/utils/HealthKit/android', () => ({
  initHealthKitForAndroid: jest.fn(),
  getStepsCountAndroid: jest.fn(),
  getDistanceWalkingAndroid: jest.fn(),
}));

describe('HealthKit', () => {
  let healthKit;

  beforeEach(() => {
    healthKit = new HealthKit();
  });

  it('should initialize correctly for iOS', () => {
    Platform.select.mockImplementation(() => initHealthKitIOS);
    healthKit.initKit();

    expect(initHealthKitIOS).toHaveBeenCalled();
  });

  it('should initialize correctly for Android', () => {
    Platform.select.mockImplementation(() => initHealthKitForAndroid);
    healthKit.initKit();

    expect(initHealthKitForAndroid).toHaveBeenCalled();
  });

  it('should get steps count for iOS when available', async () => {
    Platform.select.mockImplementation(() => getTodayStepsCountIOS);
    getTodayStepsCountIOS.mockResolvedValue(1200);
    healthKit.isAvailable = true;

    const steps = await healthKit.getStepsCount();

    expect(steps).toBe(1200);
  });

  it('should get steps count for Android when available', async () => {
    Platform.select.mockImplementation(() => getStepsCountAndroid);
    getStepsCountAndroid.mockResolvedValue(1500);
    healthKit.isAvailable = true;

    const steps = await healthKit.getStepsCount();

    expect(steps).toBe(1500);
  });

  it('should get walking distance for iOS when available', async () => {
    Platform.select.mockImplementation(() => getDistanceWalkingIOS);
    getDistanceWalkingIOS.mockResolvedValue(3.2);
    healthKit.isAvailable = true;

    const distance = await healthKit.getDistanceWalking();

    expect(distance).toBe(3.2);
  });

  it('should get walking distance for Android when available', async () => {
    Platform.select.mockImplementation(() => getDistanceWalkingAndroid);
    getDistanceWalkingAndroid.mockResolvedValue(4.5);
    healthKit.isAvailable = true;

    const distance = await healthKit.getDistanceWalking();

    expect(distance).toBe(4.5);
  });
});
