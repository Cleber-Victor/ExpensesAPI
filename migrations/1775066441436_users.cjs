exports.shorthands = undefined;

exports.up = async (pgm) => {
  pgm.createTable('users', {
    id: 'id', // Atalho para SERIAL PRIMARY KEY
    name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(100)', unique: true, notNull: true },
    password: { type: 'varchar(255)', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  }, {
    ifNotExists: true
  });
};

exports.down = async (pgm) => {
  pgm.dropTable('users');
};
