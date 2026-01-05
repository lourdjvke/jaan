
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import OnboardingOne from './components/OnboardingOne';
import OnboardingTwo from './components/OnboardingTwo';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Verification from './components/Verification';
import CreatePassword from './components/CreatePassword';
import KYCForm from './components/KYCForm';
import TransactionPin from './components/TransactionPin';
import SuccessScreen from './components/SuccessScreen';
import Dashboard from './components/Dashboard';
import Support from './components/Support';
import Notifications from './components/Notifications';
import NotificationDetails from './components/NotificationDetails';

export enum ScreenState {
  SPLASH,
  ONBOARDING_1,
  ONBOARDING_2,
  SIGN_UP,
  LOGIN,
  VERIFICATION,
  CREATE_PASSWORD,
  KYC_FORM,
  TRANSACTION_PIN,
  SUCCESS,
  DASHBOARD,
  SUPPORT,
  NOTIFICATIONS,
  NOTIFICATION_DETAILS
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>(ScreenState.SPLASH);
  const [direction, setDirection] = useState(1);
  const [notifDetailsProps, setNotifDetailsProps] = useState<any>(null);

  useEffect(() => {
    if (currentScreen === ScreenState.SPLASH) {
      const timer = setTimeout(() => {
        setDirection(1);
        setCurrentScreen(ScreenState.ONBOARDING_1);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const navigateTo = (next: ScreenState, isBack = false, props: any = null) => {
    setDirection(isBack ? -1 : 1);
    if (props) setNotifDetailsProps(props);
    setCurrentScreen(next);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  // Fixed: Added 'as const' to ensure 'spring' is treated as a literal type to satisfy Transition interface
  const transition = {
    x: { type: "spring" as const, stiffness: 200, damping: 25 },
    opacity: { duration: 0.5 }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenState.SPLASH:
        return <SplashScreen key="splash" />;
      case ScreenState.ONBOARDING_1:
        return <OnboardingOne key="onboarding1" onNext={() => navigateTo(ScreenState.ONBOARDING_2)} onSkip={() => navigateTo(ScreenState.SIGN_UP)} />;
      case ScreenState.ONBOARDING_2:
        return <OnboardingTwo key="onboarding2" onGetStarted={() => navigateTo(ScreenState.SIGN_UP)} onSkip={() => navigateTo(ScreenState.SIGN_UP)} />;
      case ScreenState.SIGN_UP:
        return <SignUp key="signup" onNext={() => navigateTo(ScreenState.VERIFICATION)} onBack={() => navigateTo(ScreenState.ONBOARDING_2, true)} onLogin={() => navigateTo(ScreenState.LOGIN)} />;
      case ScreenState.LOGIN:
        return <Login key="login" onNext={() => navigateTo(ScreenState.DASHBOARD)} onBack={() => navigateTo(ScreenState.SIGN_UP, true)} onSignUp={() => navigateTo(ScreenState.SIGN_UP)} />;
      case ScreenState.VERIFICATION:
        return <Verification key="verification" onNext={() => navigateTo(ScreenState.CREATE_PASSWORD)} onBack={() => navigateTo(ScreenState.SIGN_UP, true)} />;
      case ScreenState.CREATE_PASSWORD:
        return <CreatePassword key="password" onNext={() => navigateTo(ScreenState.KYC_FORM)} onBack={() => navigateTo(ScreenState.VERIFICATION, true)} />;
      case ScreenState.KYC_FORM:
        return <KYCForm key="kyc" onNext={() => navigateTo(ScreenState.TRANSACTION_PIN)} onBack={() => navigateTo(ScreenState.CREATE_PASSWORD, true)} />;
      case ScreenState.TRANSACTION_PIN:
        return <TransactionPin key="pin" onNext={() => navigateTo(ScreenState.SUCCESS)} onBack={() => navigateTo(ScreenState.KYC_FORM, true)} />;
      case ScreenState.SUCCESS:
        return <SuccessScreen key="success" onFinish={() => navigateTo(ScreenState.DASHBOARD)} />;
      case ScreenState.DASHBOARD:
        return <Dashboard 
          key="dashboard" 
          onLogout={() => navigateTo(ScreenState.LOGIN, true)} 
          onNavigateSupport={() => navigateTo(ScreenState.SUPPORT)}
          onNavigateNotifications={() => navigateTo(ScreenState.NOTIFICATIONS)}
          onNavigateNotifDetails={(props) => navigateTo(ScreenState.NOTIFICATION_DETAILS, false, props)}
        />;
      case ScreenState.SUPPORT:
        return <Support key="support" onBack={() => navigateTo(ScreenState.DASHBOARD, true)} />;
      case ScreenState.NOTIFICATIONS:
        return <Notifications 
          key="notifications" 
          onBack={() => navigateTo(ScreenState.DASHBOARD, true)}
          onSelectNotif={(props) => navigateTo(ScreenState.NOTIFICATION_DETAILS, false, props)}
        />;
      case ScreenState.NOTIFICATION_DETAILS:
        return <NotificationDetails 
          key="notif-details" 
          {...notifDetailsProps} 
          onBack={() => navigateTo(ScreenState.DASHBOARD, true)} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="mobile-container select-none bg-white">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentScreen}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
