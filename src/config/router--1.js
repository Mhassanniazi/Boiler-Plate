/* eslint-disable import/no-named-as-default */
import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Dashboard from 'Pages/dashboard/dashboard';
import Profile from 'Pages/profile/profile';
import AdvancedSearch from 'Pages/advancedSearch/advancedSearch';
import CompanySearch from 'Pages/advancedSearch/companySearch';
import MyLeads from 'Pages/myLeads/myLeads';
import Seeker from 'Pages/seeker/seeker';
import NewRelease from 'Pages/newRelease/newRelease';
import TeamManagement from 'Pages/teamManagement/teamManage';
import SuppressionList from 'Pages/suppressionList/suppressionList';
import PageNotFound from 'Pages/pageNotFound/pageNotFound';
import CommonPricing from 'Pages/pricing/commonPricing';
import PaygPricing from 'Pages/pricing/paygPricing';
import { ConciergeList } from 'Pages/concierge/conciergeList';
import Enrichment from 'Pages/enrichment/enrichment';
import { Utils } from 'Utils/utils';
import userDetail from 'Stores/userDetail';
import freeTrialPopupState from 'Stores/freeTrialPopupState';
import * as CONSTANTS from 'Utils/constants';
import ActivateAccount from 'Pages/activateAccount/activateAccount';
import IntegrationRouter from 'Pages/integration/integrationRouter';
import ListPage from 'Pages/myLeads/ListPage/listPage';
import SavedSearch from 'Pages/advancedSearch/savedSearch/savedSearch';
import PasswordSetup from '../pages/passwordSetup/passwordSetup';

const { PAGE_PATH_MAP, SEOCookieQueryMapping } = CONSTANTS;
const { PASSWORD_SETUP } = PAGE_PATH_MAP;

const Routes = props => {
  Utils.enableBodyScroll();
  Utils.routerProps = props;
  const { location } = props;
  const { pathname = '' } = location;

  // const { userInfo, isFreeTrial } = userDetail;
  const { isFreeTrial } = userDetail;
  // const { trialUsed } = userInfo;

  React.useEffect(() => {
    if (
      !Utils.checkIsEmailVerified(false) ||
      !Utils.checkIsSecondaryEmailVerified()
    ) {
      Utils.showActivateAccountFlow();
      freeTrialPopupState.setFreeTrialPrePopup(null);
    } else if (Utils.checkPasswordSetupFlow() && pathname !== PASSWORD_SETUP) {
      Utils.showPasswordSetupFlow();
    } else if (pathname === '/' || pathname === '/dashboard') {
      if (Utils.checkIsDashboardAllowed()) props.history.push('/dashboard');
      else
        props.history.push(
          '/advanced-search/contact?trigger=direct-access#search',
        );
    } else if (
      pathname !== '/advanced-search/contact' &&
      !isFreeTrial &&
      pathname !== PASSWORD_SETUP
    ) {
      Utils.removeLocalStorage('companySearch');
      Utils.removeLocalStorage('companySerPostData');
      Utils.removeLocalStorage('searchJson');
      Utils.deleteCookie(SEOCookieQueryMapping.seoContactURL);
      Utils.deleteCookie('seo_search');
      Utils.removeLocalStorage('showIndustrySearchCompany');
      Utils.removeLocalStorage('showIndustrySearch');
      userDetail.setCurrentTab('');
    }

    if (userDetail.userInfo.userStatus !== 0)
      userDetail.setShowNotificationType(
        CONSTANTS.NOTIFICATION_BAR_TYPE.ACTIVATION,
      );
    else if (Utils.isPaymentPendingReview())
      userDetail.setShowNotificationType(
        CONSTANTS.NOTIFICATION_BAR_TYPE.PAYMENT_PENDING_REVIEW,
      );
  }, [pathname]);

  return (
    <Switch>
      {/* old paths re routing */}
      <Route
        path="/integrations/hubspot/enrich-log/contacts"
        exact
        component={routeProps => {
          return (
            <Redirect
              to="/enrichment/hubspot/enrichment-log/contacts"
              {...routeProps}
            />
          );
        }}
      />
      <Route
        path="/integrations/hubspot/settings"
        exact
        component={routeProps => {
          return <Redirect to="/enrichment/hubspot/settings" {...routeProps} />;
        }}
      />
      {/* old paths re routing end */}
      <Route path="/" exact component={Dashboard} />
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/activate-account" exact component={ActivateAccount} />
      <Route path={PASSWORD_SETUP} exact component={PasswordSetup} />
      <Route
        path="/advanced-search/contact/saved-searches"
        exact
        component={SavedSearch}
      />
      <Route
        path="/advanced-search/contact/:savedTemplete?"
        component={AdvancedSearch}
      />
      <Route
        path="/advanced-search/company/:companyId?"
        component={CompanySearch}
      />
      <Route path="/my-leads" exact component={MyLeads} />
      <Route path="/my-leads/list/:id?" exact component={ListPage} />
      <Route
        path="/edit-profile"
        exact
        component={routeProps => {
          return <Redirect to="/profile/settings" {...routeProps} />;
        }}
      />
      <Route
        path="/my-leads/:id?"
        exact
        component={routeProps => {
          return (
            <Redirect
              to={
                routeProps.match.params.id
                  ? `/my-leads/list/${routeProps.match.params.id}${routeProps.location.search}`
                  : `/my-leads/list${routeProps.location.search}`
              }
              {...routeProps}
            />
          );
        }}
      />
      <Route path="/seeker" exact component={Seeker} />
      <Route path="/profile/:menu?/:subMenu?" exact component={Profile} />
      <Route path="/release" exact component={NewRelease} />
      <Route path="/manage-team" exact component={TeamManagement} />
      <Route path="/pricing-old" exact component={CommonPricing} />
      <Route path="/pricing" exact component={PaygPricing} />
      <Route path="/suppression-list" exact component={SuppressionList} />
      <Route path="/concierge" exact component={ConciergeList} />

      <Route path="/enrichment" component={Enrichment} />
      <Route path="/integrations" component={IntegrationRouter} />
      <Route path="/*" component={PageNotFound} />
    </Switch>
  );
};

export default withRouter(Routes);
