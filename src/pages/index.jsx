import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@component/styles/Home.module.css";
import { BrowserCodeReader, BrowserQRCodeReader } from "@zxing/browser";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [cam, setCam] = useState("");
  const [code, setCode] = useState("");
  const codeReader = new BrowserQRCodeReader();
  useEffect(() => {
    const detectInputDevices = async () => {
      const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
      console.log(videoInputDevices);
      const selectedDevice = videoInputDevices[0]?.deviceId;
      setCam(selectedDevice);
    };
    detectInputDevices();
  }, []);

  function decodeContinuously(cam) {
    codeReader.decodeFromInputVideoDeviceContinuously(
      cam,
      "cam",
      (result, err) => {
        if (result) {
          // properly decoded qr code
          console.log("Found QR code!", result);
          setCode(result.text);
        }

        if (err) {
          setCode("");

          // As long as this error belongs into one of the following categories
          // the code reader is going to continue as excepted. Any other error
          // will stop the decoding loop.
          //
          // Excepted Exceptions:
          //
          //  - NotFoundException
          //  - ChecksumException
          //  - FormatException

          if (err instanceof NotFoundException) {
            console.log("No QR code found.");
          }

          if (err instanceof ChecksumException) {
            console.log("A code was found, but it's read value was not valid.");
          }

          if (err instanceof FormatException) {
            console.log("A code was found, but it was in a invalid format.");
          }
        }
      }
    );
  }

  useEffect(() => {
    decodeContinuously(cam);
  }, [cam]);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <video id={cam} width={250} height={250}></video>
        <p>Result:{code}</p>
      </main>
    </>
  );
}
