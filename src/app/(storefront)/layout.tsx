import { CartProvider } from '@/hooks/use-cart';
import { SiteHeader } from '@/components/storefront/site-header';
import { FooterSection } from '@/sections/footer/footer-section';
import { getStoreMenu, getStoreSettings } from '@/actions/storefront-actions';
import type { MenuItem, Menu } from '@/types/menu';
async function getHeaderData() {
  const [headerMenu, settingsResult] = await Promise.all([
    getStoreMenu('header'),
    getStoreSettings(),
  ]);
  const items = (headerMenu.data as Menu | null)?.items as unknown as MenuItem[] | undefined;
  const navLinks = items
    ? items.map((item: MenuItem) => ({
        href: item.url,
        label: item.label,
        children: item.children?.length
          ? item.children.map((child: MenuItem) => ({ href: child.url, label: child.label }))
          : undefined,
      }))
    : undefined;
  const settingsArr =
    (settingsResult as unknown as { data?: Array<{ key: string; value: string }> }).data || [];
  const storeNameSetting = settingsArr.find(
    (s: { key: string; value: string }) => s.key === 'store_name',
  );
  let storeName = 'Times to Trend';
  if (storeNameSetting) {
    try {
      storeName = JSON.parse(storeNameSetting.value);
    } catch {
      storeName = storeNameSetting.value;
    }
  }
  return { navLinks, storeName };
}
async function getFooterData() {
  const [footerMenu, footerBottomMenu] = await Promise.all([
    getStoreMenu('footer'),
    getStoreMenu('footer-bottom'),
  ]);
  const footerItems = (footerMenu.data as Menu | null)?.items as unknown as MenuItem[] | undefined;
  const bottomItems = (footerBottomMenu.data as Menu | null)?.items as unknown as
    | MenuItem[]
    | undefined;
  const quickLinks = footerItems
    ? footerItems.map((item: MenuItem) => ({ href: item.url, label: item.label }))
    : undefined;
  const supportLinks = bottomItems
    ? bottomItems.map((item: MenuItem) => ({ href: item.url, label: item.label }))
    : undefined;
  return { quickLinks, supportLinks };
}
export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [headerData, footerData] = await Promise.all([getHeaderData(), getFooterData()]);
  return (
    <CartProvider>
      <SiteHeader storeName={headerData.storeName} navLinks={headerData.navLinks} />
      {children}
      <FooterSection
        quickLinks={footerData.quickLinks}
        supportLinks={footerData.supportLinks}
        storeName={headerData.storeName}
      />
    </CartProvider>
  );
}
