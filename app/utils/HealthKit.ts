import {Platform} from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';

// Android
import GoogleFit, {Scopes} from 'react-native-google-fit';

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
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_ACTIVITY_WRITE,
        Scopes.FITNESS_LOCATION_READ,
      ],
    };

    GoogleFit.authorize(options)
      .then(authResult => {
        if (authResult.success) {
          console.log('AUTH_SUCCESS');
          this.handleKitSuccess();
        } else {
          this.handleKitError('AUTH_DENIED');
          console.log('AUTH_DENIED', authResult.message);
        }
      })
      .catch(error => {
        console.log('AUTH_ERROR');
        this.handleKitError(error);
      });
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

// Android
const getStepsCountAndroid = async () => {
  try {
    const res = await GoogleFit.getDailySteps();
    const dailyStepCount = res.filter(
      re => re.source === 'com.google.android.gms:estimated_steps',
    )[0];

    return dailyStepCount.steps[0].value;
  } catch (e) {
    console.log('error getStepsCountAndroid', e);
  }
};

// TODO: Clean code
const getDistanceWalkingAndroid = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
    const startOfDay = today.toISOString();

    const opt = {
      startDate: startOfDay,
      endDate: new Date().toISOString(),
    };

    const res = await GoogleFit.getDailyDistanceSamples(opt);

    return res[0].distance ? res[0].distance / 1609.344 : 0.0;
  } catch (e) {}
};

export default HealthKit;
