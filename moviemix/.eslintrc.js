module.exports = {
  root: true,
  extends: ['universe/native'],
  ignorePatterns: ['node_modules/', 'admin/', 'backend/', 'supabase/functions/', 'dist/', '.expo/'],
  rules: {
    // Match the codebase's single-quote style (universe defaults to double).
    'prettier/prettier': ['warn', { singleQuote: true }],
  },
};

