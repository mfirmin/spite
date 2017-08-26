import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/main.ts',

  plugins: [
      typescript(),
//      babel({
//          exclude: [
//              '../node_modules/**',
//              '../src/lib/ammo.js',
//  //            '../src/lib/three.min.js',
//              '../src/lib/graham_scan.min.js',
//              '../src/lib/jquery-2.1.4.min.js',
//          ],
//          runtimeHelpers: true,
//      }),
//      builtins(),
//      commonjs({
//          include: [
//              '../node_modules/**',
//              '../src/lib/ammo.js',
//  //                '../src/lib/three.min.js',
//              '../src/lib/graham_scan.min.js',
//              '../src/lib/jquery-2.1.4.min.js',
//          ],
//          ignoreGlobal: false,
//          sourceMap: false,
//      }),
//      nodeResolver({ jsnext: true, main: true }),
  ],
  output: {
      file: './static/game.js',
      format: 'umd',
      name: 'game',
  },
};
