exports.shorthands = undefined;

exports.up = async (pgm) => {
  pgm.createTable('expenses', {
    id: 'id', // Atalho para SERIAL PRIMARY KEY
    
    // 👇 RELACIONAMENTO (Foreign Key)
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"', // Referencia a tabela 'users'
      onDelete: 'cascade',   // Se deletar o usuário, apaga as despesas dele
    },
    
    description: { type: 'varchar(255)', notNull: true },
    amount: { type: 'decimal(10,2)', notNull: true }, // 10 dígitos, sendo 2 decimais
    date: { type: 'date', notNull: true },
    
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = async (pgm) => {
  pgm.dropTable('expenses');
};
