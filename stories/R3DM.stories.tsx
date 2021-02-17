import React from 'react';
import { Meta, Story } from '@storybook/react';
import { parsePathD, View, ViewProps } from '../src';

const PATH_D =
  'm25.645 38.743c2.061 2.882 8.35 3.09 10.51 1.868.793-.449.991-1.747.991-2.627 0-.604-.159-1.079-.477-1.424-.336-.345-1.189-1.221-2.178-1.48-5.02-1.294-8.492-2.911-9.852-4.085-1.696-1.467-1.969-2.425-1.969-4.979 0-2.554.734-4.695 2.395-6.231 1.66-1.536 4.071-2.304 7.233-2.304 3.02 0 7.268.797 9.339 3.256l-3.453 3.756c-1.947-1.635-3.396-1.783-5.78-1.783-1.501 0-2.283.216-2.919.647-.636.414-.954.958-.954 1.631 0 .604.291 1.105.874 1.501.583.414 2.106 1.036 5.144 1.864 3.409.932 5.723 2.062 6.942 3.391 1.201 1.329 1.802 3.098 1.802 5.307 0 2.658-.936 4.85-2.808 6.575-1.855 1.726-4.138 3.067-7.423 3.067-4.229 0-9.874-1.494-11.431-4.255';

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

const Template: Story<ViewProps> = (args) => (
  <>
    Path Data:
    <br />
    <pre>{JSON.stringify(parsePathD(PATH_D), null, 2)}</pre>
    <View {...args} />
  </>
);

export const Default = Template.bind({});

Default.args = {};
