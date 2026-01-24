export async function POST(req) {
  const linkId = Math.random().toString(36).substring(2, 8);
  global.tempFiles = global.tempFiles || {};

  global.tempFiles[linkId] = {
    files: [
      '/files/example-demo.pdf',
      '/files/demo-video.mp4'
    ],
    price: 0.2
  };

  return new Response(JSON.stringify({ link: `/unlock/${linkId}` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
