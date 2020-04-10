import React, { Component, useState } from "react";
import mojs from "mo-js";
import styles from "./index.css";

const initialState = {
  count: 0,
  countTotal: 234,
  isClicked: false
};

/**
 * Higher Order Component
 */
const withClapAnimation = WrappedComponent => {
  class WithClapAnimation extends Component {
    animationTimeline = new mojs.Timeline();
    state = {
      animationTimeline: this.animationTimeline
    };

    componentDidMount() {
      const tlDuration = 300;
      const scaleButton = new mojs.Html({
        el: "#clap",
        duration: tlDuration,
        scale: { 1.3: 1 },
        easing: mojs.easing.ease.out
      });

      const triangleBurst = new mojs.Burst({
        parent: "#clap", //From where the burst shall come out of
        radius: { 50: 95 },
        count: 5,
        angle: 30,
        duration: tlDuration,
        children: {
          shape: "polygon",
          radius: { 6: 0 },
          stroke: "rgba(211,54,0,0.5)",
          strokeWidth: 2,
          angle: 210,
          speed: 0.2,
          delay: 30,
          easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
        }
      });

      const circularBurst = new mojs.Burst({
        parent: "#clap", //From where the burst shall come out of
        radius: { 50: 75 },
        count: 5,
        angle: 25,
        duration: tlDuration,
        children: {
          shape: "circle",
          radius: { 3: 0 },
          fill: "rgba(149,165,166,0.5)",
          speed: 0.2,
          delay: 30,
          easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
        }
      });

      const countTotalAnimation = new mojs.Html({
        el: "#clapCountTotal",
        duration: tlDuration,
        opacity: { 0: 1 },
        delay: (3 * tlDuration) / 2,
        y: { 0: -3 }
      });

      const countAnimation = new mojs.Html({
        el: "#clapCount",
        duration: tlDuration,
        y: { 0: -30 },
        opacity: { 0: 1 }
      }).then({
        opacity: { 1: 0 },
        delay: tlDuration / 2,
        y: -80
      });

      const clap = document.getElementById("clap");
      clap.style.transform = "scale(1,1)";

      const newAnimationTimeline = this.animationTimeline.add([
        scaleButton,
        countTotalAnimation,
        countAnimation,
        triangleBurst,
        circularBurst
      ]);
      this.setState({ animationTimeline: newAnimationTimeline });
    }
    render() {
      return (
        <WrappedComponent
          {...this.props}
          animationTimeline={this.state.animationTimeline}
        />
      );
    }
  }

  return WithClapAnimation;
};

const MediumClap = ({ animationTimeline }) => {
  animationTimeline.replay();
  const MAX_USER_CLAP = 50;
  const [clapState, setClapState] = useState(initialState);
  const { count, countTotal, isClicked } = clapState;
  const handleClapClick = () => {
    setClapState(prevState => ({
      count: Math.min(prevState.count + 1, MAX_USER_CLAP),
      countTotal:
        count < MAX_USER_CLAP ? prevState.countTotal + 1 : prevState.countTotal,
      isClicked: true
    }));
  };
  return (
    <button id="clap" className={styles.clap} onClick={handleClapClick}>
      <ClapIcon isClicked={isClicked} />
      <ClapCount count={count} />
      <CountTotal countTotal={countTotal} />
    </button>
  );
};

/**
 * Subcomponents
 */

const ClapCount = ({ count }) => {
  return (
    <span className={styles.count} id="clapCount">
      + {count}
    </span>
  );
};

const CountTotal = ({ countTotal }) => {
  return (
    <span className={styles.total} id="clapCountTotal">
      {countTotal}
    </span>
  );
};

const ClapIcon = ({ isClicked }) => {
  return (
    <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100.08 125"
        className={`${styles.icon} ${isClicked && styles.checked}`}
      >
        <path d="M77.704 12.876c1.175 1.144 1.931 2.559 2.264 4.053.367-.27.756-.503 1.158-.706.971-1.92.654-4.314-.964-5.891-1.998-1.944-5.198-1.915-7.151.091l-.216.222c1.844.174 3.568.927 4.909 2.231zM48.893 26.914c.407.885.687 1.93.791 3.057l16.478-16.928c.63-.648 1.364-1.144 2.145-1.545 1.006-1.93.712-4.367-.925-5.96-2.002-1.948-5.213-1.891-7.155.108L44.722 21.575c2.321 2.261 3.098 3.024 4.171 5.339zM10.041 66.626c-.118-8.864 3.219-17.24 9.396-23.584l18.559-19.064c.727-2.031.497-4.076-.076-5.319-.843-1.817-1.314-2.271-3.55-4.451L13.501 35.645C2.944 46.489 2.253 63.277 11.239 74.94c-.729-2.681-1.161-5.462-1.198-8.314z" />
        <path d="M21.678 45.206l20.869-21.437c2.237 2.18 2.708 2.634 3.55 4.451.837 1.819.994 5.356-1.607 8.05L32.642 48.514c-.459.471-.446 1.228.028 1.689.472.457 1.228.452 1.686-.019l34.047-34.976c1.941-1.999 5.153-2.056 7.155-.108 1.998 1.944 2.03 5.159.089 7.155L50.979 47.584c-.452.464-.437 1.224.038 1.688.482.466 1.234.457 1.689-.009l28.483-29.28c1.952-2.005 5.153-2.035 7.15-.09 1.995 1.943 2.048 5.142.097 7.144L59.944 56.308c-.453.466-.441 1.223.038 1.688.469.456 1.227.449 1.678-.015l24.66-25.336c1.942-1.995 5.15-2.061 7.15-.113 2.003 1.949 2.043 5.175.101 7.17l-24.675 25.32c-.453.467-.442 1.219.038 1.688.47.457 1.231.453 1.682-.014l14.56-14.973c1.958-2.013 5.167-2.043 7.159-.107 2.011 1.96 2.051 5.152.09 7.164L64.792 87.17c-11.576 11.892-30.638 12.153-42.54.569-11.903-11.588-12.149-30.644-.574-42.533" />
      </svg>
    </span>
  );
};

/**
 * Usage
 */
const Usage = () => {
  const AnimatedMediumClap = withClapAnimation(MediumClap);
  return <AnimatedMediumClap />;
};

export default Usage;
