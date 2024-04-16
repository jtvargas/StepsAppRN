import {Platform} from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';

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

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    ],
    write: [],
  },
};

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
      ios: () => this.initHealthKitIOS(),
      android: () => this.initHealthKitForAndroid(),
      default: () => this.handleKitError('Platform not supported'),
    });

    initializer?.();
  }

  private async initHealthKitIOS(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('INITIALIZING HEALTH KIT iOS...');
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        if (error) {
          console.error('[ERROR] Cannot grant permissions!', error);
          reject(this.handleKitError(error));
        } else {
          console.log('HEALTH KIT has permissions...');
          resolve(this.handleKitSuccess());
        }
      });
    });
  }

  private initHealthKitForAndroid(): void {
    // AppleHealthKit.initHealthKit(permissions, (error: string) => {
    //   if (error) {
    //     console.error('[ERROR] Cannot grant permissions!', error);
    //     this.handleKitError(error);
    //   } else {
    //     this.handleKitSuccess();
    //   }
    // });
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
      android: () => Promise.resolve(0),
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
      android: () => Promise.resolve(0),
      default: () => Promise.resolve(0),
    });

    return walkingDistance() as Promise<number>;
  }
}

// Get Steps today iOS
const getTodayStepsCountIOS = () => {
  return new Promise((resolve, reject) => {
    let options = {
      date: new Date().toISOString(),
      includeManuallyAdded: false,
    };

    AppleHealthKit.getStepCount(
      options,
      (err: Object, results: HealthValue) => {
        console.log({err, results});
        if (err) {
          reject(err);
          return;
        }

        resolve(results.value);
      },
    );
  });
};

const getDistanceWalkingIOS = () => {
  return new Promise((resolve, reject) => {
    let options = {
      unit: 'mile',
    } as HealthInputOptions;

    AppleHealthKit.getDistanceWalkingRunning(
      options,
      (err: Object, results: HealthValue) => {
        if (err) {
          reject(err);
          return;
        }
        console.log({value: results.value});
        resolve(results.value);
      },
    );
  });
};
export default HealthKit;
