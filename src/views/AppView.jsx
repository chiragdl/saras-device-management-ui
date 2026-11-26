import React from 'react';
import LoginScreen from '../screens/LoginScreen.jsx';
import SkipLink from '../screens/SkipLink.jsx';
import AppHeader from '../screens/AppHeader.jsx';
import FleetBar from '../screens/FleetBar.jsx';
import SvgDefs from '../screens/SvgDefs.jsx';
import AppFooter from '../screens/AppFooter.jsx';
import RegisterDrawer from '../screens/RegisterDrawer.jsx';
import Toast from '../screens/Toast.jsx';
import PatchDialog from '../screens/PatchDialog.jsx';
import AlertsDrawer from '../screens/AlertsDrawer.jsx';
import OutageBanner from '../screens/OutageBanner.jsx';
import DeviceDetail from '../screens/DeviceDetail.jsx';
import Dashboard from '../screens/Dashboard.jsx';
import BoxKeyDialog from '../screens/BoxKeyDialog.jsx';
import PasswordDialog from '../screens/PasswordDialog.jsx';
import SettingsPage from '../screens/SettingsPage.jsx';

export default function AppView(v) {
  if (v.isLogin) return <LoginScreen {...v} />;
  if (!v.isDash) return null;
  return (
    <>
      <SkipLink {...v} />
      <AppHeader {...v} />
      <FleetBar {...v} />
      <SvgDefs {...v} />
      <main id="main" tabIndex="-1" style={{ padding: `${v.mainPadTop} 24px 32px`, minHeight: "calc(100vh - 56px)", background: "#F5F7FA", display: "flex", flexDirection: "column", gap: "20px" }}>
        <OutageBanner {...v} />
        <SettingsPage {...v} />
        <DeviceDetail {...v} />
        <Dashboard {...v} />
      </main>
      <AppFooter {...v} />
      <RegisterDrawer {...v} />
      <Toast {...v} />
      <PatchDialog {...v} />
      <AlertsDrawer {...v} />
      <BoxKeyDialog {...v} />
      <PasswordDialog {...v} />
    </>
  );
}
