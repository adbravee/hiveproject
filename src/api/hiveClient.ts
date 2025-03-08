import { Client } from '@hiveio/dhive';

const client = new Client(['https://api.hive.blog', 'https://api.hivekings.com']);

export const getBlockchainStats = async (): Promise<any> => {
  try {
    const dynamicProps = await client.database.getDynamicGlobalProperties();
    const accounts = await client.database.call('get_account_count', []);
    
    // Get recent blocks for transaction analysis
    const headBlock = dynamicProps.head_block_number;
    const blocks = await Promise.all(
      Array.from({ length: 10 }, (_, i) => 
        client.database.getBlock(headBlock - i)
      )
    );

    const totalTransactions = blocks.reduce((acc, block) => 
      acc + (block?.transactions?.length || 0), 0
    );

    return {
      totalAccounts: accounts,
      totalPosts: dynamicProps.post_count,
      activeAccounts: Math.floor(accounts * 0.15), // Approximate active accounts
      averageTransactions: totalTransactions / blocks.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching blockchain stats:', error);
    throw error;
  }
};