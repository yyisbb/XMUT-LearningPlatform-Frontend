import Mock from 'mockjs';
import { isSSR } from '@/utils/is';

import './message-box';

if (!isSSR) {
  Mock.setup({
    timeout: '500-1500',
  });
}
