export const baseStates = {
  min_height: null,
  fullLoading: false,
  is_collapsed: false,
  base_height_difference: 65,
  logo_src: '/dist/vendor/image/logo.png',
  default_head_img: '/dist/vendor/image/head/head1.jpg'
};

export const baseMutation = {
  'SET_MIN_HEIGHT'(state, minHeight) {
    state.min_height = minHeight;
  },
  'SET_FULL_LOADING'(state, flag) {
    // if(flag){
    //   Pace.start();
    // }else{
    //   Pace.stop();
    // }
    state.fullLoading = flag;
  }
};
