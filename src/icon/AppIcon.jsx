/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  CaretDown,
  ChartLine,
  FileText,
  House,
  Moon,
  Pill,
  SignOut,
  SmileyNervous,
  Sun,
  TestTube,
  User,
  UserList,
} from 'phosphor-react';

const libIcons = {
  house: House,
  'smiley-nervous': SmileyNervous,
  'test-tube': TestTube,
  'file-text': FileText,
  'chart-line': ChartLine,
  pill: Pill,
  user: User,
  'caret-down': CaretDown,
  sun: Sun,
  moon: Moon,
  'user-list': UserList,
  'sign-out': SignOut,
  // add more icons here
};

/**
 * AppIcon component
 * @param {Object} props props of the component
 * @param {string} props.icon name of the icon
 * @returns {JSX.Element} AppIcon component
 */
function AppIcon({ icon, ...rest }) {
  const Icon = libIcons[icon];
  if (!Icon) return null;

  return <Icon {...rest} />;
}

export default AppIcon;
