import { animated, useSpring } from "@react-spring/three";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import Head from "next/head";
import React, { Suspense, useEffect, useState } from "react";
import Effects from "../components/Effects";
import {
  ActionButton,
  AnimatedPanel,
  Panel,
  PanelList,
  Text,
} from "../components/hud";
import Ribbon from "../components/Ribbon";
import { entry } from "../components/sounds";
import pkg from "../package.json";
import { styled } from "../stitches";
import styles from "../styles/Home.module.css";

const Main = styled("main", {
  width: "100vw",
  height: "100vh",
  position: "fixed",
  margin: 0,
  padding: 0,
});

const VersionTag = styled("div", {
  position: "fixed",
  right: "$2",
  bottom: "$2",
  opacity: 0.3,
  color: "white",
  pointerEvents: "none",
});

const PlayWithArtPrompt = styled("div", {
  position: "fixed",
  right: "$2",
  left: "$2",
  bottom: "4%",
  textAlign: "center",
  opacity: 0.3,
  color: "white",
  pointerEvents: "none",
});

const Overlay = styled("div", {
  gridColumn: "1 / 5",
  gridRow: "1 / 5",
  paddingBottom: "$space$6",
  color: "white",
  overflowY: "auto",

  pointerEvents: "all",

  variants: {
    layout: {
      sm: {
        gridColumn: "1 / 5",
        gridRow: "1 / 5",
        maxWidth: "$sidebar$maxWidth",
        paddingBottom: "$space$6",
      },
      md: {
        gridColumn: "1 / 3",
        gridRow: "1 / 5",
        paddingBottom: "0",
      },
      lg: {
        gridColumn: "1 / 3",
        gridRow: "1 / 5",
        minWidth: "$sidebar$minWidth",
        maxWidth: "$sidebar$maxWidth",
        paddingBottom: "0",
      },
    },
  },
});

const Padding = styled("div", {
  padding: "$2",
  boxSizing: "border-box",
  variants: {
    layout: {
      sm: {
        padding: "$1",
      },
      md: {
        padding: "$2",
      },
      lg: {
        padding: "$3",
      },
    },
  },
});

const HudGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "25% 25% 25% 25%",
  gridTemplateRows: "25% 25% 25% 25%",

  position: "fixed",
  pointerEvents: "none",

  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
});

const OverlayRight = styled("div", {
  display: "none",
  color: "white",
  overflowY: "auto",

  pointerEvents: "all",

  variants: {
    layout: {
      sm: {
        display: "none",
      },
      md: {
        display: "block",
        gridColumn: "4 / 5",
        gridRow: "1 / 5",
      },
      lg: {
        justifySelf: "end",
        display: "block",
        gridColumn: "4 / 5",
        gridRow: "1 / 5",
        // minWidth: "$sidebar$minWidth",
        maxWidth: "$sidebar$maxWidth",
      },
    },
  },
});

const visit = (url: string, delay: number = 0) => {
  if (delay > 0) {
    setTimeout(() => {
      window.open(url, "_blank");
    }, delay);
  } else {
    window.open(url, "_blank");
  }
};

const DesktopOnly = () => {
  return (
    <Padding layout="md">
      <PanelList>
        <AnimatedPanel
          title="More info about Sushi Roll"
          actions={[
            <ActionButton
              onActivate={() =>
                visit(
                  "https://discord.com/users/196742608846979072",
                  300
                )
              }
              index={0}
              key={0}
              activationKey="Y"
            >
              Discord
            </ActionButton>,
          ]}
        >
            <Text>
              <br></br>
              Want more information about Sushi Roll?
              Feel free to message FayeVR#0001 on Discord.
            </Text>
        </AnimatedPanel>
        <AnimatedPanel
          title="View Source"
          toggleable={false}
          actions={[
            <ActionButton
              onActivate={() =>
                visit("https://git.suro.club/suro/suro.club", 300)
              }
              index={0}
              key={0}
              activationKey="Q"
            >
              view code
            </ActionButton>,
          ]}
        >
          <Text>
            The code for this site on github, it&apos;s built with react,
            next.js, stitchesjs, react-three-fiber, react-spring, framer-motion,
            zzfx and of course, love.
          </Text>
        </AnimatedPanel>
      </PanelList>
    </Padding>
  );
};

const Visibility = styled("div", {
  variants: {
    visiblity: {
      visible: {
        display: "block",
      },
      hidden: {
        display: "none",
      },
    },
  },
});

const Greetings = styled("div", {
  gridColumn: "2 / 3",
  gridRow: "2 / 3",
  pointerEvents: "all",
  variants: {
    size: {
      small: {
        gridColumn: "1 / 5",
        gridRow: "2 / 4",
      },
      regular: {
        gridColumn: "2 / 3",
        gridRow: "2 / 3",
      },
    },
  },
});

const Maximised = styled("div", {
  gridColumn: "1 / 4",
  gridRow: "1 / 1",
  pointerEvents: "all",
  variants: {
    layout: {
      small: {
        gridColumn: "1 / 5",
        gridRow: "1 / 1",

        maxWidth: "$sidebar$maxWidth",
      },
      large: {
        gridColumn: "1 / 3",
        gridRow: "1 / 1",
        maxWidth: "$sidebar$maxWidth",
      },
    },
  },
});

const Home: NextPage = () => {
  const showBg = true;

  const [view, setView] = useState<"initial" | "active" | "maximised">(
    "initial"
  );
  const { scale } = useSpring({
    scale: view === "initial" ? 0.1 : 1,
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>
          Sushi Roll
        </title>
        <meta
          name="description"
          content="current status: Making sushi like a boss"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        {showBg && (
          <Canvas camera={{ position: [15, 15, 15] }}>
            <color attach="background" args={["black"]} />
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <pointLight position={[30, 0, 0]} color="blue" intensity={10} />
              <pointLight position={[0, -30, 0]} color="pink" intensity={5} />
              <pointLight position={[0, 0, 30]} color="purple" intensity={5} />
              <animated.group scale={scale}>
                <Ribbon id={1} color="#7b505c" />
                <Ribbon id={64} color="#E8AE3B" />
                <Ribbon id={256} color="#E8AE3B" />
                <Ribbon id={512} color="#E8AE3B" />
                <Ribbon id={128} color="#e4d6cf" />
              </animated.group>
              <Effects />
            </Suspense>
            <OrbitControls
              minPolarAngle={Math.PI / 10}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        )}
      </Main>

      <VersionTag>
        <Text>
          Sushi Roll
          {" " + pkg.version}
        </Text>
      </VersionTag>
      <HudGrid className="hud">
        {view === "maximised" && (
          <Maximised layout={{ "@initial": "small", "@bp2": "large" }}>
            <Padding layout="md">
              <PanelList>
                <AnimatedPanel
                  title="Go Back"
                  actions={[
                    <ActionButton
                      onActivate={() => {
                        setTimeout(entry, 100);
                        setTimeout(() => {
                          setView("active");
                        }, 300);
                      }}
                      index={0}
                      key={0}
                      activationKey="B"
                    >
                      back to site
                    </ActionButton>,
                  ]}
                >
                  <Text>Use the mouse or touch to pan, zoom and rotate.</Text>
                </AnimatedPanel>
              </PanelList>
            </Padding>
          </Maximised>
        )}
        {view === "initial" && (
          <Greetings size={{ "@initial": "small", "@bp1": "regular" }}>
            <Padding layout="md">
              <PanelList>
                <Panel title="BF.WTF">
                  <Text>Welcome.</Text>
                  <br />
                  <ActionButton
                    onActivate={() => {
                      setTimeout(entry, 100);
                      setTimeout(() => {
                        setView("active");
                      }, 300);
                    }}
                    index={0}
                    key={0}
                    activationKey="A"
                  >
                    activate
                  </ActionButton>
                </Panel>
              </PanelList>
            </Padding>
          </Greetings>
        )}
        {view === "active" && (
          <>
            <Visibility visiblity={{ "@initial": "hidden", "@bp4": "visible" }}>
              <PlayWithArtPrompt>
                <Text>click + drag + scroll</Text>
              </PlayWithArtPrompt>
            </Visibility>
            <Overlay
              layout={{
                "@initial": "sm",
                "@bp1": "sm",
                "@bp2": "md",
                "@bp3": "lg",
              }}
            >
              <Padding layout="md">
                <PanelList>
                  <AnimatedPanel title="Welcome">
                    <Text>Hi, we are Sushi Roll and this is our homepage.</Text>
                    <br />

                    <Text>
                      We are a bunch of idiots that play games and develop the weirdest ideas.
                    </Text>
                    <br></br>
                    <Text>
                    Somehow we also host stuff, who would&apos;ve thought of that?
                    </Text>
                  </AnimatedPanel>


                  <AnimatedPanel
                    title="Projects"
                    actions={[
                      <ActionButton
                        onActivate={() => visit("https://git.suro.club", 300)}
                        index={0}
                        key={0}
                        activationKey="C"
                      >
                        Our Github
                      </ActionButton>,
                      <ActionButton
                        onActivate={() =>
                          visit("https://panel.suro.club", 300)
                        }
                        index={1}
                        key={1}
                        activationKey="G"
                      >
                        Game Server Panel
                      </ActionButton>,
                    ]}
                  >
                    <Text>
                      Guess what, we make stuff! Here are some links to our Projects.
                    </Text>
                    <br></br>
                    <Text>
                      Keep in mind, that most links are behind a login and are not openly accessable unless friends with SR (Sushi Roll).
                    </Text>
                  </AnimatedPanel>

                  <AnimatedPanel
                    title="Support Us"
                    toggleable={false}
                    actions={[
                      <ActionButton
                        onActivate={() =>
                          visit("https://www.paypal.com/paypalme/minifoxtv", 300)
                        }
                        index={1}
                        key={1}
                        activationKey="4"
                      >
                        donate $
                      </ActionButton>,
                    ]}
                  ></AnimatedPanel>

                  <AnimatedPanel
                    title="Explore Mode"
                    toggleable={false}
                    actions={[
                      <ActionButton
                        onActivate={() =>
                          setTimeout(() => setView("maximised"), 300)
                        }
                        index={0}
                        key={0}
                        activationKey="X"
                      >
                        maximise art
                      </ActionButton>,
                    ]}
                  ></AnimatedPanel>
                </PanelList>
              </Padding>
            </Overlay>
          </>
        )}
        {view === "active" && (
          <OverlayRight
            layout={{
              "@initial": "sm",
              "@bp1": "sm",
              "@bp2": "md",
              "@bp3": "lg",
            }}
            className="source-panel"
          >
            <DesktopOnly />
          </OverlayRight>
        )}
      </HudGrid>
    </div>
  );
};

export default Home;
