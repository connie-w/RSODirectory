import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render () {
    return (
      <html lang='en-us'>
        <Head>
          <meta charset='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />

          <title>RSO Directory</title>

          <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' />
          <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.4.1/css/all.css' integrity='sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz' crossorigin='anonymous' />
          <link rel='stylesheet' href='index.css' />

          <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js' />

          <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
