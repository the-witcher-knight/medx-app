import React from 'react';
import AppContent from 'layout/AppContainer';
import AppFooter from 'layout/AppFooter';
import AppSidebar from 'layout/AppSidebar';
import AppTopbar from 'layout/AppTopbar';

const sideWidth = 200;

const routes = [
  {
    name: 'Trang chủ',
    icon: 'house',
    path: '/',
  },
  {
    name: 'Bệnh nhân',
    icon: 'smiley-nervous',
    path: '/patient',
  },
  {
    name: 'Xét nghiệm',
    icon: 'test-tube',
    path: '/test-manage',
  },
  {
    name: 'Báo cáo',
    icon: 'file-text',
    path: '/report',
  },
  {
    name: 'Thống kê',
    icon: 'chart-line',
    path: '/statistic',
  },
  {
    name: 'Bác sĩ',
    icon: 'pill',
    path: '/doctor',
  },
  {
    name: 'Người dùng',
    icon: 'user',
    path: '/user',
  },
];

function App() {
  return (
    <div className="App">
      <AppTopbar />
      <AppSidebar
        display={{ base: 'none', md: 'flex' }}
        w={sideWidth}
        routes={routes}
        pos="fixed"
      />
      <AppContent ml={{ base: 0, md: sideWidth }}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid libero voluptas corporis
        amet quae magni illum! Perferendis fugiat recusandae similique magnam, in odit ea,
        perspiciatis, dolores explicabo eligendi ratione animi.
        <AppFooter />
      </AppContent>
    </div>
  );
}

export default App;
