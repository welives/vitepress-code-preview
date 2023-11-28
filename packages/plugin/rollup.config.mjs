import ts from 'rollup-plugin-ts'
export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/index.js',
      format: 'es',
    },
  ],
  plugins: [ts()],
  watch: { exclude: 'node_modules/**' },
  external: ['vite', 'vitepress'],
}
