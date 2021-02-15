import React from 'react';
import { Meta, Story } from '@storybook/react';
import { R3DM } from '../src';
import ViewProps = R3DM.ViewProps;
import View = R3DM.View;

const meta: Meta = {
  title: 'View',
  component: View,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<ViewProps> = (args) => <View {...args} />;

export const Default = Template.bind({});

Default.args = {};
