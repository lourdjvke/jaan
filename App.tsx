
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import OnboardingOne from './components/OnboardingOne';
import OnboardingTwo from './components/OnboardingTwo';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import VerificationSent from './components/VerificationSent';
import CreatePassword from './components/CreatePassword';
import KYCForm from './components/KYCForm';
import TransactionPin from './components/TransactionPin';
import SuccessScreen from './components/SuccessScreen';
import Dashboard from './components/Dashboard';
import Support from './components/Support';
import Notifications from './components/Notifications';
import NotificationDetails from './components/NotificationDetails';
import IntlAirtime from './components/IntlAirtime';
import Toast from './components/Toast';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, set } from 'firebase/database';

export enum ScreenState {
  SPLASH,
  ONBOARDING_1,
  ONBOARDING_2,
  SIGN_UP,
  LOGIN,
  FORGOT_PASSWORD,
  VERIFICATION_SENT,
  CREATE_PASSWORD,
  KYC_FORM,
  TRANSACTION_PIN,
  SUCCESS,
  DASHBOARD,
  SUPPORT,
  NOTIFICATIONS,
  NOTIFICATION_DETAILS,
  INTL_AIRTIME
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>(ScreenState.SPLASH);
  const [direction, setDirection] = useState(1);
  const [notifDetailsProps, setNotifDetailsProps] = useState<any>(null);
  const [userEmail, setUserEmail] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });

  const navigateTo = useCallback((next: ScreenState, isBack = false, props: any = null) => {
    if (isBack) {
      history.go(-1);
    } else {
      history.pushState({ screen: next }, '');
      setDirection(1);
      if (props) setNotifDetailsProps(props);
      setCurrentScreen(next);
      if (auth.currentUser) set(ref(db, `users/${auth.currentUser.uid}/onboarding/lastStep`), next);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        setDirection(-1);
        setCurrentScreen(event.state.screen);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || '');
        if (!user.emailVerified) {
          if (currentScreen !== ScreenState.VERIFICATION_SENT) navigateTo(ScreenState.VERIFICATION_SENT);
          return;
        }
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          const lastStep = userData?.onboarding?.lastStep;
          const kyc = userData?.kyc;
          const pin = userData?.transactionPin;
          const isAtGateway = [ScreenState.SPLASH, ScreenState.LOGIN, ScreenState.SIGN_UP].includes(currentScreen);
          if (isAtGateway) {
             if (!kyc) navigateTo(ScreenState.KYC_FORM);
             else if (!pin) navigateTo(ScreenState.TRANSACTION_PIN);
             else if (lastStep === ScreenState.SUCCESS) navigateTo(ScreenState.SUCCESS);
             else navigateTo(ScreenState.DASHBOARD);
          } else if (currentScreen === ScreenState.DASHBOARD && !pin) {
             navigateTo(ScreenState.TRANSACTION_PIN);
          }
        }, { onlyOnce: true });
      }
    });
    if (currentScreen === ScreenState.SPLASH) {
      const timer = setTimeout(() => {
        navigateTo(ScreenState.ONBOARDING_1);
      }, 2500);
      return () => { unsubscribe(); clearTimeout(timer); };
    }
    return () => unsubscribe();
  }, [currentScreen, navigateTo]);

  const showToast = (message: string) => setToast({ visible: true, message });

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenState.SPLASH: return <SplashScreen />;
      case ScreenState.ONBOARDING_1: return <OnboardingOne onNext={() => navigateTo(ScreenState.ONBOARDING_2)} onSkip={() => navigateTo(ScreenState.SIGN_UP)} />;
      case ScreenState.ONBOARDING_2: return <OnboardingTwo onGetStarted={() => navigateTo(ScreenState.SIGN_UP)} onSkip={() => navigateTo(ScreenState.SIGN_UP)} />;
      case ScreenState.SIGN_UP: return <SignUp onNext={(email) => { setUserEmail(email); navigateTo(ScreenState.VERIFICATION_SENT); }} onBack={() => navigateTo(ScreenState.ONBOARDING_2, true)} onLogin={() => navigateTo(ScreenState.LOGIN)} onSocialClick={() => showToast("Coming soon")} showToast={showToast} />;
      case ScreenState.LOGIN: return <Login onBack={() => navigateTo(ScreenState.SIGN_UP, true)} onSignUp={() => navigateTo(ScreenState.SIGN_UP)} onForgot={() => navigateTo(ScreenState.FORGOT_PASSWORD)} onSocialClick={() => showToast("Coming soon")} showToast={showToast} />;
      case ScreenState.FORGOT_PASSWORD: return <ForgotPassword onBack={() => navigateTo(ScreenState.LOGIN, true)} showToast={showToast} />;
      case ScreenState.VERIFICATION_SENT: return <VerificationSent email={userEmail} onVerified={() => navigateTo(ScreenState.CREATE_PASSWORD)} onBack={() => { auth.signOut(); navigateTo(ScreenState.SIGN_UP, true); }} />;
      case ScreenState.CREATE_PASSWORD: return <CreatePassword onNext={() => navigateTo(ScreenState.KYC_FORM)} onBack={() => navigateTo(ScreenState.VERIFICATION_SENT, true)} />;
      case ScreenState.KYC_FORM: return <KYCForm onNext={() => navigateTo(ScreenState.TRANSACTION_PIN)} onBack={() => navigateTo(ScreenState.CREATE_PASSWORD, true)} />;
      case ScreenState.TRANSACTION_PIN: return <TransactionPin onNext={() => navigateTo(ScreenState.SUCCESS)} onBack={() => navigateTo(ScreenState.KYC_FORM, true)} />;
      case ScreenState.SUCCESS: return <SuccessScreen onFinish={() => navigateTo(ScreenState.DASHBOARD)} />;
      case ScreenState.DASHBOARD: return <Dashboard 
          onLogout={async () => { await auth.signOut(); navigateTo(ScreenState.LOGIN); }} 
          onNavigateSupport={() => navigateTo(ScreenState.SUPPORT)}
          onNavigateNotifications={() => navigateTo(ScreenState.NOTIFICATIONS)}
          onNavigateNotifDetails={(props) => navigateTo(ScreenState.NOTIFICATION_DETAILS, false, props)}
          onNavigateIntl={() => navigateTo(ScreenState.INTL_AIRTIME)}
          showToast={showToast}
        />;
      case ScreenState.SUPPORT: return <Support onBack={() => navigateTo(ScreenState.DASHBOARD, true)} />;
      case ScreenState.NOTIFICATIONS: return <Notifications onBack={() => navigateTo(ScreenState.DASHBOARD, true)} onSelectNotif={(props) => navigateTo(ScreenState.NOTIFICATION_DETAILS, false, props)} />;
      case ScreenState.NOTIFICATION_DETAILS: return <NotificationDetails {...notifDetailsProps} onBack={() => navigateTo(ScreenState.DASHBOARD, true)} />;
      case ScreenState.INTL_AIRTIME: return <IntlAirtime onBack={() => navigateTo(ScreenState.DASHBOARD, true)} showToast={showToast} />;
      default: return null;
    }
  };

  return (
    <div className="mobile-container select-none bg-white">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentScreen}
          custom={direction}
          variants={{ enter: d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }), center: { x: 0, opacity: 1 }, exit: d => ({ x: d < 0 ? '100%' : '-100%', opacity: 0 }) }}
          initial="enter" animate="center" exit="exit"
          transition={{ x: { type: "spring", stiffness: 200, damping: 25 }, opacity: { duration: 0.5 } }}
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      <Toast visible={toast.visible} message={toast.message} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  );
};

export default App;
