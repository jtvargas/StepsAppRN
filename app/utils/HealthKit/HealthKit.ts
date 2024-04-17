import {Platform} from 'react-native';
// iOS kit FNs
import {
  getTodayStepsCountIOS,
  getDistanceWalkingIOS,
  initHealthKitIOS,
} from './ios';

// Android kit FNs
import {
  getStepsCountAndroid,
  getDistanceWalkingAndroid,
  initHealthKitForAndroid,
} from './android';

export interface IHealthKit {
  isAvailable: boolean;
  initKit(): void;
  getStepsCount(): Promise<number>;
  subscribe(observerFunction: () => void): () => void;
  unsubscribe(observerFunction: () => void): void;
  notifyObservers(): void;
  handleKitSuccess(): void;
  handleKitError(error: string): void;
  getStepsCount(): Promise<number>;
  getDistanceWalking(): Promise<number>;
}
type ObserverFunction = () => void;

class HealthKit implements IHealthKit {
  private observers: ObserverFunction[] = [];

  subscribe(observerFunction: ObserverFunction) {
    this.observers.push(observerFunction);

    return () => {
      this.unsubscribe(observerFunction);
    };
  }

  notifyObservers() {
    this.observers.forEach(callback => callback());
  }

  unsubscribe(observerFunction: ObserverFunction) {
    this.observers = this.observers.filter(
      subscriber => subscriber !== observerFunction,
    );
  }

  isAvailable: boolean = false;

  constructor() {
    this.initKit();
  }

  initKit() {
    console.log('INITIALIZING HEALTH KIT...');

    const initializer = Platform.select({
      ios: () => initHealthKitIOS(this.handleKitSuccess, this.handleKitError),
      android: () =>
        initHealthKitForAndroid(this.handleKitSuccess, this.handleKitError),
      default: () => this.handleKitError('Platform not supported'),
    });

    initializer?.();
  }

  handleKitSuccess = (): void => {
    this.isAvailable = true;

    console.log('HEALTH KIT INITIALIZED');
    this.notifyObservers();
  };

  handleKitError = (error: string): void => {
    this.isAvailable = false;

    console.error(`ERROR INITIALIZING HEALTH KIT: ${error}`);
    this.notifyObservers();
  };

  getStepsCount() {
    if (!this.isAvailable) {
      console.log('HEALTH KIT IS NOT AVAILABLE');
      return Promise.resolve(0);
    }

    console.log('GET STEPS COUNT FUNC!');

    const stepsCountFunction = Platform.select({
      ios: getTodayStepsCountIOS,
      android: getStepsCountAndroid,
      default: () => Promise.resolve(0),
    });

    return stepsCountFunction() as Promise<number>;
  }

  getDistanceWalking() {
    if (!this.isAvailable) {
      console.log('HEALTH KIT IS NOT AVAILABLE');
      return Promise.resolve(0);
    }

    console.log('GET WALKING DISTANCE FUNC!');

    const walkingDistance = Platform.select({
      ios: getDistanceWalkingIOS,
      android: getDistanceWalkingAndroid,
      default: () => Promise.resolve(0),
    });

    return walkingDistance() as Promise<number>;
  }
}

export default HealthKit;
