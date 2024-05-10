import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
  createRunOncePlugin,
} from "@expo/config-plugins";
import fs from "fs";

const pkg = {
  name: "@videosdk.live/react-native-foreground-service",
  version: "UNVERSIONED",
}; //require("@videosdk.live/react-native-foreground-service/package.json");

const withForegroundService: ConfigPlugin = (config) => {
  config = withAndroidManifest(config, async (config) => {
    //     const permissionTemplate = `
    // <uses-permission
    //     android:name="android.permission.BLUETOOTH"
    //     android:maxSdkVersion="30" />
    // <uses-permission
    //     android:name="android.permission.BLUETOOTH_ADMIN"
    //     android:maxSdkVersion="30" />
    // `;

    //     const androidManifestPath = `${process.cwd()}/android/app/src/main/AndroidManifest.xml`;

    //     fs.readFile(androidManifestPath, "utf8", (err, data) => {
    //       if (err) {
    //         return console.log(err);
    //       }

    //       if (!data.includes(permissionTemplate)) {
    //         const reg = /<\/manifest>/;
    //         const result = data.replace(reg, `${permissionTemplate}\n</manifest>`);

    //         fs.writeFile(androidManifestPath, result, "utf8", (err) => {
    //           if (err) return console.log(err);
    //           console.log("Permissions added successfully.");
    //         });
    //       } else {
    //         console.log("Permissions already exist.");
    //       }
    //     });

    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    // set the metadata
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "live.videosdk.rnfgservice.notification_channel_name",
      "Meeting Notification",
      "value"
    );
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "live.videosdk.rnfgservice.notification_channel_description",
      "Whenever meeting started notification will appear.",
      "value"
    );
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "live.videosdk.rnfgservice.notification_color",
      "@color/orange",
      "resource"
    );

    // set the services
    mainApplication.service = [];
    mainApplication.service.push({
      $: {
        "android:name": "live.videosdk.rnfgservice.ForegroundService",
        // @ts-ignore
        "android:foregroundServiceType": "mediaProjection",
      },
    });
    mainApplication.service.push({
      $: {
        "android:name": "live.videosdk.rnfgservice.ForegroundServiceTask",
      },
    });

    const colorTemplate = `
  <resources>
    <item  name="orange"  type="color">#FF4500
    </item>
    <integer-array  name="androidcolors">
    <item>@color/orange</item>
    </integer-array>
  </resources>
`;

    const colorFilePath = `${process.cwd()}/android/app/src/main/res/values/colors.xml`;

    fs.writeFile(colorFilePath, colorTemplate, "utf8", function (err) {
      if (err) {
        return console.log(err);
      }

      console.log(`Successfully created color file at ${colorFilePath}`);
    });

    return config;
  });

  // config = AndroidConfig.Permissions.withPermissions(config, [
  //   "android.permission.FOREGROUND_SERVICE",

  //   "android.permission.BLUETOOTH_ADMIN",
  //   "android.permission.BLUETOOTH",
  //   "android.permission.BLUETOOTH_CONNECT",
  // ]);

  return config;
};

export default createRunOncePlugin(
  withForegroundService,
  pkg.name,
  pkg.version
);
