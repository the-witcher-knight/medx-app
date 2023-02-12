/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  CaretDown,
  CaretUp,
  ChartLine,
  FileText,
  FirstAidKit,
  Funnel,
  House,
  MagnifyingGlass,
  Moon,
  Pen,
  Pill,
  Plus,
  Question,
  SignOut,
  SmileyNervous,
  Sun,
  TestTube,
  Trash,
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
  'caret-up': CaretUp,
  sun: Sun,
  moon: Moon,
  'user-list': UserList,
  'sign-out': SignOut,
  question: Question,
  'first-aid-kit': FirstAidKit,
  'manifying-glass': MagnifyingGlass,
  funnel: Funnel,
  plus: Plus,
  pen: Pen,
  trash: Trash,
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
