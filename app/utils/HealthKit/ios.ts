import AppleHealthKit, {
  HealthValue,
  HealthInputOptions,
  HealthKitPermissions,
} from 'react-native-health';

const permissionsIOS: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    ],
    write: [],
  },
};

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

const initHealthKitIOS = async (
  handleSuccess: () => void,
  handleError: (error: string) => void,
) => {
  return new Promise((resolve, reject) => {
    console.log('INITIALIZING HEALTH KIT iOS...');
    AppleHealthKit.initHealthKit(permissionsIOS, (error: string) => {
      if (error) {
        console.error('[ERROR] Cannot grant permissions!', error);
        reject(handleError(error));
      } else {
        console.log('HEALTH KIT has permissions...');
        resolve(handleSuccess());
      }
    });
  });
};

export {getTodayStepsCountIOS, getDistanceWalkingIOS, initHealthKitIOS};
