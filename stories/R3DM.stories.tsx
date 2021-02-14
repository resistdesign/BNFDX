import React from 'react';
import { Meta, Story } from '@storybook/react';
import { R3DM, R3DMProps } from '../src';

const meta: Meta = {
  title: 'R3DM',
  component: R3DM,
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

const Template: Story<R3DMProps> = args => <R3DM {...args} />;

export const Default = Template.bind({});

Default.args = {};
