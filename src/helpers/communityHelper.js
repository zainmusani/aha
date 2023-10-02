import util from '../util';

export function manipulateCommunitiesListData(list) {
  if (util.isArrayEmpty(list)) return [];
  let mCommunityList = [];

  list.forEach((item, index) => {
    let mCommunity = {};
    mCommunity['id'] = item?.id ?? index;
    mCommunity['artistId'] = item?.artist_id ?? index;
    mCommunity['image'] = item?.image ?? undefined;
    mCommunity['profile_name'] = item?.name ?? '';
    mCommunity['isFollowing'] = item?.is_following ?? false;

    mCommunityList.push(mCommunity);
  });

  return mCommunityList;
}
