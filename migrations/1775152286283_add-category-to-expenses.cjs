exports.shorthands = undefined;

exports.up = async (pgm) => {
  pgm.addColumn('expenses', {
    category: {
      type: 'varchar(50)',
      notNull: true,
      default: 'Others'
    }
  });
};

exports.down = async (pgm) => {
  pgm.dropColumn('expenses', 'category');
};
