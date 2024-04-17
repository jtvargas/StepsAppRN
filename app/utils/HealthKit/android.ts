import GoogleFit, {Scopes} from 'react-native-google-fit';

// Android FNs
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

const initHealthKitForAndroid = async (
  handleSuccess: () => void,
  handleError: (error: string) => void,
) => {
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
        handleSuccess();
      } else {
        handleError('AUTH_DENIED');
        console.log('AUTH_DENIED', authResult.message);
      }
    })
    .catch(error => {
      console.log('AUTH_ERROR');
      handleError(error);
    });
};

export {
  getStepsCountAndroid,
  getDistanceWalkingAndroid,
  initHealthKitForAndroid,
};
