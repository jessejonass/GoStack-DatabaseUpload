import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError'; // errors

// import customRepository pois o repositório usado é um repository criado por mim

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    // importar o repository já que ele acessa o bd
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category); // criar um repositorio a partir da model

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    // criar uma nova categoria antes da transação
    // verificar se categoria existe
    let transactionCategory = await categoryRepository.findOne({
      where: {
        // se a categoria já existe
        title: category,
      },
    });

    // não existe? criar
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    // funções de repositório | funções de bando de dados
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    // inserir na transaction / salvar
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
