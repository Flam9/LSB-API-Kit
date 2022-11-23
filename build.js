require('esbuild').buildSync({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: ['node18'],
  outfile: 'dist/index.js',
});
