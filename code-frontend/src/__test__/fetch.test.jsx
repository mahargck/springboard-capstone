import {render, fireEvent, screen} from '@testing-library/react'
import { fetchDivisions, fetchDivisionId,
  fetchDivisionTopicId, fetchTopicFullId, fetchTopics, fetchTopicsUpdate,
  fetchColumns, fetchColumnsUpdate,
  fetchData, fetchItemUpdate,
  fetchZipCode,
  fetchUserLogin, fetchUserRegister, fetchUserUpdate,
  fetchUserReset, fetchUserLogout,
  fetchUserItems, fetchUserItems_Add, fetchUserItems_Comment, fetchUserItems_Delete, fetchUserBookmarks
} from '../fetch'


describe('Fetch', () => {
  let originalError;
  beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn(); // Suppresses the error output
  });
  afterAll(() => {
    console.error = originalError; // Restore original console
  });

  const oldFetch = global.fetch;
  beforeEach(() => {});
  afterEach(() => {
    global.fetch = oldFetch
  });

  it('fetchDivisions', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchDivisions Data")})
    global.fetch = mockJest

    expect(await fetchDivisions()).toEqual("fetchDivisions Data")
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchDivisionId', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchDivisionId Data")})
    global.fetch = mockJest

    expect(await fetchDivisionId()).toEqual("fetchDivisionId Data")
    expect(mockJest).toHaveBeenCalledTimes(1);
  })
  it('fetchDivisionId, value', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchDivisionId Data")})
    global.fetch = mockJest

    expect(await fetchDivisionId("value")).toEqual("fetchDivisionId Data")
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchDivisionTopicId, missing 2', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => (["fetchDivisionTopicId Data"])})
    global.fetch = mockJest

    expect(fetchDivisionTopicId()).rejects.toThrow("Missing Division")
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchDivisionTopicId, missing 1', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => (["fetchDivisionTopicId Data"])})
    global.fetch = mockJest

    expect(fetchDivisionTopicId("Division")).rejects.toThrow("Missing Topic")
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchDivisionTopicId, missing 0', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => (["fetchDivisionTopicId Data"])})
    global.fetch = mockJest

    const result = await fetchDivisionTopicId("Division", "Topic")
    expect(result).toEqual("fetchDivisionTopicId Data")
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchTopicFullId, missing', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchTopicFullId Data")})
    global.fetch = mockJest

    expect(fetchTopicFullId()).rejects.toThrow("Missing topic_id")
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchTopicFullId', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchTopicFullId Data")})
    global.fetch = mockJest

    const result = await fetchTopicFullId(1)
    expect(result).toEqual("fetchTopicFullId Data")
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchColumns', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchColumns Data")})
    global.fetch = mockJest

    const result = await fetchColumns()
    expect(result).toEqual("fetchColumns Data")
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchColumnsUpdate, missing', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchColumnsUpdate Data")})
    global.fetch = mockJest

    expect(fetchColumnsUpdate()).rejects.toThrow("Missing Column Data")
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchColumnsUpdate', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchColumnsUpdate Data")})
    global.fetch = mockJest

    const result = await fetchColumnsUpdate("Column Data")
    expect(result).toEqual("fetchColumnsUpdate Data")
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchData, missing', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchData Data")})
    global.fetch = mockJest

    expect(fetchData()).rejects.toThrow("Missing topic_id")
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchData', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchData Data")})
    global.fetch = mockJest

    const result = await fetchData(12345)
    expect(result).toEqual("fetchData Data")
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchTopics', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchTopics Data")})
    global.fetch = mockJest

    const result = await fetchTopics()
    expect(result).toEqual("fetchTopics Data")
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchTopicsUpdate, missing', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchTopicsUpdate Data")})
    global.fetch = mockJest

    expect(fetchTopicsUpdate()).rejects.toThrow("Missing Topic Data")
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchTopicsUpdate', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchTopicsUpdate Data")})
    global.fetch = mockJest

    const result = await fetchTopicsUpdate("data")
    expect(result).toEqual("fetchTopicsUpdate Data")
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchItemUpdate, missing', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchItemUpdate Data")})
    global.fetch = mockJest

    expect(fetchItemUpdate()).rejects.toThrow("Missing Item Data")
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchItemUpdate', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchItemUpdate Data")})
    global.fetch = mockJest

    const result = await fetchItemUpdate("data")
    expect(result).toEqual("fetchItemUpdate Data")
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchZipCode, missing', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchZipCode Data")})
    global.fetch = mockJest

    expect(fetchZipCode()).rejects.toThrow("Missing Zip Code");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchZipCode', async () => {
    const mockJest = jest.fn()
      .mockResolvedValueOnce({ json: async () => ({
        state: "KY",
        city: "The Barn",
        county: "The Field"
      })})
      .mockResolvedValueOnce({ json: async () => ({
        zone: "6a",
        temperature_range: "1 to 2"
      })})
    global.fetch = mockJest

    const result = await fetchZipCode("data")
    expect(JSON.stringify(result)).toEqual(JSON.stringify({
      state: "KY",
      zone: 6,
      city: "The Barn",
      county: "The Field",
      temperature: [1,2]
    }))
    expect(mockJest).toHaveBeenCalledTimes(2);
  })

  it('fetchUserLogin, missing', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserLogin Data")})
    global.fetch = mockJest

    expect(fetchUserLogin()).rejects.toThrow("Missing data");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserLogin, missing email', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserLogin Data")})
    global.fetch = mockJest

    expect(fetchUserLogin({})).rejects.toThrow("Missing email");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserLogin, missing email', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserLogin Data")})
    global.fetch = mockJest

    expect(fetchUserLogin({email: "email"})).rejects.toThrow("Missing password");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserLogin', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserLogin Data")})
    global.fetch = mockJest

    const result = await fetchUserLogin({email: "old.mcdonald@farm.com", password: "e-i-e-i-o"})
    expect(JSON.stringify(result)).toEqual(JSON.stringify("fetchUserLogin Data"))
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchUserRegister, missing', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserRegister Data")})
    global.fetch = mockJest

    expect(fetchUserRegister()).rejects.toThrow("Missing data");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserRegister, missing email', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserRegister Data")})
    global.fetch = mockJest

    expect(fetchUserRegister({})).rejects.toThrow("Missing email");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserRegister, missing email', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserRegister Data")})
    global.fetch = mockJest

    expect(fetchUserRegister({email: "email"})).rejects.toThrow("Missing password");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserRegister', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserRegister Data")})
    global.fetch = mockJest

    const result = await fetchUserRegister({email: "old.mcdonald@farm.com", password: "e-i-e-i-o"})
    expect(JSON.stringify(result)).toEqual(JSON.stringify("fetchUserRegister Data"))
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchUserUpdate, missing', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserUpdate Data")})
    global.fetch = mockJest

    expect(fetchUserUpdate()).rejects.toThrow("Missing data");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserUpdate, missing user_id', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserUpdate Data")})
    global.fetch = mockJest

    expect(fetchUserUpdate({})).rejects.toThrow("Missing user_id");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserUpdate', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserUpdate Data")})
    global.fetch = mockJest

    const result = await fetchUserUpdate({user_id: 123})
    expect(JSON.stringify(result)).toEqual(JSON.stringify("fetchUserUpdate Data"))
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchUserReset, missing', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserReset Data")})
    global.fetch = mockJest

    expect(fetchUserReset()).rejects.toThrow("Missing data");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserReset, missing user_id', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserReset Data")})
    global.fetch = mockJest

    expect(fetchUserReset({})).rejects.toThrow("Missing user_id");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserReset, missing old_password', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserReset Data")})
    global.fetch = mockJest

    expect(fetchUserReset({user_id: 123})).rejects.toThrow("Missing old_password");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserReset, missing password', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserReset Data")})
    global.fetch = mockJest

    expect(fetchUserReset({user_id: 123, old_password: "pswd"})).rejects.toThrow("Missing password");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserReset', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserReset Data")})
    global.fetch = mockJest

    const result = await fetchUserReset({user_id: 123, old_password: "pswd", password: "PSWD"})
    expect(JSON.stringify(result)).toEqual(JSON.stringify("fetchUserReset Data"))
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchUserLogout', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserLogout Data")})
    global.fetch = mockJest

    await fetchUserLogout()
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchUserItems, missing', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems Data")})
    global.fetch = mockJest

    expect(fetchUserItems()).rejects.toThrow("Missing user_id");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserItems', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems Data")})
    global.fetch = mockJest

    const result = await fetchUserItems(123)
    expect(JSON.stringify(result)).toEqual(JSON.stringify("fetchUserItems Data"))
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchUserItems_Add, missing user_id', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems_Add Data")})
    global.fetch = mockJest

    expect(fetchUserItems_Add()).rejects.toThrow("Missing user_id");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserItems_Add, missing item_id', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems_Add Data")})
    global.fetch = mockJest

    expect(fetchUserItems_Add(123)).rejects.toThrow("Missing item_id");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserItems_Add', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems_Add Data")})
    global.fetch = mockJest

    const result = await fetchUserItems_Add(123, 456)
    expect(JSON.stringify(result)).toEqual(JSON.stringify("fetchUserItems_Add Data"))
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchUserItems_Comment, missing user_id', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems_Comment Data")})
    global.fetch = mockJest

    expect(fetchUserItems_Comment()).rejects.toThrow("Missing user_id");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserItems_Comment, missing id', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems_Comment Data")})
    global.fetch = mockJest

    expect(fetchUserItems_Comment(123)).rejects.toThrow("Missing id");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserItems_Comment, missing comments', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems_Comment Data")})
    global.fetch = mockJest

    expect(fetchUserItems_Comment(123, 456)).rejects.toThrow("Missing comments");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserItems_Comment', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems_Comment Data")})
    global.fetch = mockJest

    const result = await fetchUserItems_Comment(123, 456, "comment")
    expect(JSON.stringify(result)).toEqual(JSON.stringify("fetchUserItems_Comment Data"))
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchUserItems_Delete, missing user_id', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems_Delete Data")})
    global.fetch = mockJest

    expect(fetchUserItems_Delete()).rejects.toThrow("Missing user_id");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserItems_Delete, missing id', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems_Delete Data")})
    global.fetch = mockJest

    expect(fetchUserItems_Delete(123)).rejects.toThrow("Missing id");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserItems_Delete', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserItems_Delete Data")})
    global.fetch = mockJest

    const result = await fetchUserItems_Delete(123, 456)
    expect(JSON.stringify(result)).toEqual(JSON.stringify("fetchUserItems_Delete Data"))
    expect(mockJest).toHaveBeenCalledTimes(1);
  })

  it('fetchUserBookmarks, missing user_id', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserBookmarks Data")})
    global.fetch = mockJest

    expect(fetchUserBookmarks()).rejects.toThrow("Missing user_id");
    expect(mockJest).toHaveBeenCalledTimes(0);
  })
  it('fetchUserBookmarks', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ("fetchUserBookmarks Data")})
    global.fetch = mockJest

    const result = await fetchUserBookmarks(123)
    expect(JSON.stringify(result)).toEqual(JSON.stringify("fetchUserBookmarks Data"))
    expect(mockJest).toHaveBeenCalledTimes(1);
  })
})