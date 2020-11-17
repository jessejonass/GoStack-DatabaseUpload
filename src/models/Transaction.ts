import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import Category from './Category'; // tipando com o model Category

// Entity é um decorator
@Entity('transactions') // falar pra classe que ela é uma entidate com o nome de 'transactions'
class Transaction {
  // decorator que informa que é uma chave primária e já informa que é do tipo uuid
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() // não precisa parametro pq já é string
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column('decimal') // quando é number precisa explicitar
  value: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' }) // qual coluna dentro do ManyToOne acima usada para o relacionamento
  category: Category;

  @Column()
  category_id: string;

  @CreateDateColumn() // decorator com o tipo da coluna como created e updated
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
