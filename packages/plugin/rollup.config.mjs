import ts from 'rollup-plugin-ts'
export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
    },
  ],
  external: ['vue', 'vite', 'vitepress'],
  plugins: [ts()],
}
