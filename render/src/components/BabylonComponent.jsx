import React from "react";
import { Vector3, HemisphericLight, DirectionalLight, AnimationPropertiesOverride, ArcRotateCamera, ShadowGenerator, SceneLoader, Color3 } from "@babylonjs/core";
import * as GUI from '@babylonjs/gui/2D';
import SceneComponent from "./SceneComponent"; // uses above component in same directory
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import 'babylonjs-loaders';

let box;

const onSceneReady = (scene) => {

  const engine = scene.getEngine();
  // This creates and positions a free camera (non-mesh)
  const camera = new ArcRotateCamera("camera1", -Math.PI / 2, Math.PI / 4, 3, new Vector3(0, 1, 0), scene);

  const canvas = scene.getEngine().getRenderingCanvas();
  camera.attachControl(canvas, true);

  camera.lowerRadiusLimit = 500;
  camera.upperRadiusLimit = 500;
  camera.wheelDeltaPercentage = 0.01;

  const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
  light.intensity = 0.6;
  light.specular = Color3.Black();
  
  const light2 = new DirectionalLight("dir01", new Vector3(0, -0.5, -1.0), scene);
  light2.position = new Vector3(0, 5, 5);
  
    // Shadows
  var shadowGenerator = new ShadowGenerator(1024, light2);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurKernel = 32;
  
  engine.displayLoadingUI();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/cctuan/3dmodel-assets/main/", "magan.babylon", scene, function (newMeshes, particleSystems, skeletons) {
      const skeleton = skeletons[0];

      shadowGenerator.addShadowCaster(scene.meshes[0], true);
      for (var index = 0; index < newMeshes.length; index++) {
          newMeshes[index].receiveShadows = false;;
      }

      const helper = scene.createDefaultEnvironment({
          enableGroundShadow: true
      });
      helper.setMainColor(BABYLON.Color3.Gray());
      helper.ground.position.y += 0.01;

      // ROBOT
      skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
      skeleton.animationPropertiesOverride.enableBlending = true;
      skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
      skeleton.animationPropertiesOverride.loopMode = 1;
  
      var idleRange = skeleton.getAnimationRange("TPose");
      var walkRange = skeleton.getAnimationRange("Walk");
      var runRange = skeleton.getAnimationRange("TurnBack");
      var leftRange = skeleton.getAnimationRange("TurnLeft");
      var rightRange = skeleton.getAnimationRange("TurnRight");
      
      // IDLE
      if (idleRange) scene.beginAnimation(skeleton, idleRange.from, idleRange.to, true);
         
      // UI
      var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
      var UiPanel = new GUI.StackPanel();
      UiPanel.width = "220px";
      UiPanel.fontSize = "14px";
      UiPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
      UiPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      advancedTexture.addControl(UiPanel);
      // ..
      var button = GUI.Button.CreateSimpleButton("but1", "Play Idle");
      button.paddingTop = "10px";
      button.width = "100px";
      button.height = "50px";
      button.color = "white";
      button.background = "green";
      button.onPointerDownObservable.add(()=> {
          if (idleRange) scene.beginAnimation(skeleton, idleRange.from, idleRange.to, true);
      });
      UiPanel.addControl(button);
      // ..
      var button1 = GUI.Button.CreateSimpleButton("but2", "Play Walk");
      button1.paddingTop = "10px";
      button1.width = "100px";
      button1.height = "50px";
      button1.color = "white";
      button1.background = "green";
      button1.onPointerDownObservable.add(()=> {
          if (walkRange) scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
      });
      UiPanel.addControl(button1);
      // ..
      var button1 = GUI.Button.CreateSimpleButton("but3", "Play Run");
      button1.paddingTop = "10px";
      button1.width = "100px";
      button1.height = "50px";
      button1.color = "white";
      button1.background = "green";
      button1.onPointerDownObservable.add(()=> {
          if (runRange) scene.beginAnimation(skeleton, runRange.from, runRange.to, true);
      });
      UiPanel.addControl(button1);
      // ..
      var button1 = GUI.Button.CreateSimpleButton("but4", "Play Left");
      button1.paddingTop = "10px";
      button1.width = "100px";
      button1.height = "50px";
      button1.color = "white";
      button1.background = "green";
      button1.onPointerDownObservable.add(()=> {
          if (leftRange) scene.beginAnimation(skeleton, leftRange.from, leftRange.to, true);
      });
      UiPanel.addControl(button1);
      // ..
      var button1 = GUI.Button.CreateSimpleButton("but5", "Play Right");
      button1.paddingTop = "10px";
      button1.width = "100px";
      button1.height = "50px";
      button1.color = "white";
      button1.background = "green";
      button1.onPointerDownObservable.add(()=> {
          if (rightRange) scene.beginAnimation(skeleton, rightRange.from, rightRange.to, true);
      });
      UiPanel.addControl(button1);
      // ..
      var button1 = GUI.Button.CreateSimpleButton("but6", "Play Blend");
      button1.paddingTop = "10px";
      button1.width = "100px";
      button1.height = "50px";
      button1.color = "white";
      button1.background = "green";
      button1.onPointerDownObservable.add(()=> {
          if (walkRange && leftRange) {
              scene.stopAnimation(skeleton);
              var walkAnim = scene.beginWeightedAnimation(skeleton, walkRange.from, walkRange.to, 0.5, true);
              var leftAnim = scene.beginWeightedAnimation(skeleton, leftRange.from, leftRange.to, 0.5, true);

              // Note: Sync Speed Ratio With Master Walk Animation
              walkAnim.syncWith(null);
              leftAnim.syncWith(walkAnim);
          }
      });
      UiPanel.addControl(button1);

      engine.hideLoadingUI();
  });

  // // Our built-in 'box' shape.
  // box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // // Move the box upward 1/2 its height
  // box.position.y = 1;

  // // Our built-in 'ground' shape.
  // MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {
  if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

export default () => (
  <div>
    <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
  </div>
);