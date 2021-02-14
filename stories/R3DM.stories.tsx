import React from 'react';
import { Meta, Story } from '@storybook/react';
import { React3DMicro } from '../src';
import ViewProps = React3DMicro.ViewProps;
import View = React3DMicro.View;

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
