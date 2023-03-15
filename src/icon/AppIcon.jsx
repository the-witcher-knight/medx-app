/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  ArrowCounterClockwise,
  BoundingBox,
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  ChartLine,
  Check,
  DotsThreeOutlineVertical,
  FileText,
  FirstAidKit,
  FloppyDisk,
  Funnel,
  House,
  MagnifyingGlass,
  Moon,
  NotePencil,
  Pen,
  Percent,
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
  X,
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
  'floppy-disk': FloppyDisk,
  x: X,
  'caret-double-left': CaretDoubleLeft,
  'caret-left': CaretLeft,
  'caret-right': CaretRight,
  'caret-double-right': CaretDoubleRight,
  check: Check,
  'dots-three-outline-vertical': DotsThreeOutlineVertical,
  'arrow-counter-clockwise': ArrowCounterClockwise,
  'note-pencil': NotePencil,
  percent: Percent,
  'bounding-box': BoundingBox,
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
