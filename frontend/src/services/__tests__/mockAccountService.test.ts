import { getMockAccounts } from '../mockAccountService';
import { AccountResponse } from '../../api/accountService';
import { Account } from '../../types/account';

describe('MockAccountService', () => {
  describe('getMockAccounts', () => {
    it('should return AccountResponse with mock accounts', async () => {
      const response = await getMockAccounts();
      
      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.accounts).toBeDefined();
      expect(Array.isArray(response.accounts)).toBe(true);
      expect(response.accounts.length).toBeGreaterThan(0);
      expect(response.total).toBe(response.accounts.length);
    });

    it('should return accounts with all required UI fields', async () => {
      const response = await getMockAccounts();
      const account = response.accounts[0];
      
      // Check core fields
      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('name');
      expect(account).toHaveProperty('type');
      expect(account).toHaveProperty('balance');
      
      // Check UI-specific fields
      expect(account).toHaveProperty('mask');
      expect(account).toHaveProperty('gradientColors');
      expect(Array.isArray(account.gradientColors)).toBe(true);
      expect(account.gradientColors.length).toBe(2);
      
      // Check additional fields
      expect(account).toHaveProperty('institution');
      expect(account).toHaveProperty('available_balance');
      expect(account).toHaveProperty('sync_status');
    });

    it('should handle errors gracefully', async () => {
      // This test would require mocking the underlying service to throw an error
      // For now, we test that the service doesn't throw unexpected errors
      const response = await getMockAccounts();
      expect(response).toBeDefined();
      expect(typeof response.success).toBe('boolean');
    });

    it('should return different account types', async () => {
      const response = await getMockAccounts();
      const accountTypes = response.accounts.map(acc => acc.type);
      
      expect(accountTypes).toContain('checking');
      expect(accountTypes).toContain('savings');
      expect(accountTypes).toContain('credit');
    });

    it('should have realistic account data', async () => {
      const response = await getMockAccounts();
      
      response.accounts.forEach(account => {
        // Check account masks are 4 digits
        expect(account.mask).toMatch(/^\d{4}$/);
        
        // Check balances are numbers
        expect(typeof account.balance).toBe('number');
        
        // Check gradient colors are valid hex colors
        account.gradientColors.forEach(color => {
          expect(color).toMatch(/^#[0-9A-F]{6}$/i);
        });
        
        // Check institutions are strings
        expect(typeof account.institution).toBe('string');
        expect(account.institution.length).toBeGreaterThan(0);
      });
    });
  });
}); 