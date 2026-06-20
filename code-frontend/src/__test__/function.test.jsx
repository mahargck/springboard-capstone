import {render, fireEvent, screen} from '@testing-library/react'
import {FormNull, NullForm, proper, zoneToString, stringToZone, textDataType } from '../functions'

describe('Functions', () => {
  let originalError;

  beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn(); // Suppresses the error output
  });

  afterAll(() => {
    console.error = originalError; // Restore original console
  });

  it('stringToZone', () => {
    expect(stringToZone("1")).toEqual(1)
    expect(stringToZone("8a")).toEqual(8)
    expect(stringToZone("8b")).toEqual(8.5)
  })
  it('stringToZone error', () => {
    expect(stringToZone()).toEqual(NaN)
    expect(stringToZone("a")).toEqual(NaN)
    expect(stringToZone(1)).toEqual(NaN)
    expect(stringToZone(null)).toEqual(NaN)
  })

  it('zoneToString', () => {
    expect(zoneToString(8)).toEqual("8a")
    expect(zoneToString(8.5)).toEqual("8b")
  })
  it('zoneToString error', () => {
    expect(zoneToString()).toEqual("Not specified")
    expect(zoneToString("a")).toEqual("Not specified")
    expect(zoneToString({})).toEqual("Not specified")
    expect(zoneToString([])).toEqual("Not specified")
    expect(zoneToString(null)).toEqual("Not specified")
  })

  it('proper', () => {
    expect(proper("hello")).toEqual("Hello")
    expect(proper("hello world")).toEqual("Hello World")
    expect(proper("HELLO")).toEqual("Hello")
  })
  it('proper error', () => {
    expect(proper()).toEqual(null)
    expect(proper(null)).toEqual(null)
    expect(proper(1)).toEqual(null)
    expect(proper(["Hello"])).toEqual(null)
    expect(proper({name: "Hello"})).toEqual(null)
  })
  it('NullForm', () => {
    expect(NullForm({name: "hello"}).name).toEqual("hello")
    expect(NullForm({name: ""}).name).toEqual("")
    expect(NullForm({name: null}).name).toEqual("")
    expect(JSON.stringify(NullForm([""]))).toEqual(JSON.stringify([""]))
    expect(JSON.stringify(NullForm([null]))).toEqual(JSON.stringify([""]))
  })
  it('NullForm error', () => {
    expect(JSON.stringify(NullForm(["Hello"]))).toEqual(JSON.stringify(["Hello"]))
    expect(NullForm()).toEqual()
    expect(NullForm("")).toEqual("")
    expect(NullForm(null)).toEqual("")
    expect(NullForm(1)).toEqual(1)
    expect(typeof NullForm(()=> {})).toEqual("function")
  })
  it('FormNull', () => {
    expect(FormNull({name: "hello"}).name).toEqual("hello")
    expect(FormNull({name: ""}).name).toEqual(null)
    expect(FormNull({name: null}).name).toEqual(null)
    expect(JSON.stringify(FormNull([""]))).toEqual(JSON.stringify([null]))
    expect(JSON.stringify(FormNull([null]))).toEqual(JSON.stringify([null]))
  })
  it('FormNull error', () => {
    expect(JSON.stringify(FormNull(["Hello"]))).toEqual(JSON.stringify(["Hello"]))
    expect(FormNull()).toEqual()
    expect(FormNull("")).toEqual(null)
    expect(FormNull(null)).toEqual(null)
    expect(FormNull(1)).toEqual(1)
    expect(typeof FormNull(()=> {})).toEqual("function")
  })
  it('textDataType', () => {
    expect(textDataType()).toEqual()
    expect(textDataType("number")).toEqual()
    expect(textDataType("string")).toEqual()
    expect(textDataType("image")).toEqual()
    expect(textDataType("number", 1)).toEqual(1)
    expect(textDataType("number", "a")).toEqual("a")
    expect(typeof textDataType("image", "a")).toEqual("object")
    expect(typeof textDataType("string", ["a"])).toEqual("object")
    expect(textDataType("number", [1, 2])).toEqual("1 - 2")
    expect(textDataType(undefined, 1)).toEqual()
    expect(textDataType(undefined, "a")).toEqual()
  })
  it('textDataType symbols', () => {
    expect(textDataType("number", 1, {"1": "x"})).toEqual("x")
    expect(textDataType("number", 1, {"2": "x"})).toEqual(1)
    expect(textDataType("string", "test", {"test": "good"})).toEqual("good")
    expect(textDataType("string", "test", {"testing": "good"})).toEqual("test")
  })
  it('textDataType image', () => {
    render(textDataType("image", "a"));
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'a');
  })
  it('textDataType image array 1', () => {
    render(textDataType("image", ["a"]));

    const listElement = screen.getByRole('list'); //ul
    expect(listElement).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'a');
  })
  it('textDataType image array 2', () => {
    render(textDataType("image", ["a", "b"]));
    const listElement = screen.getByRole('list'); //ul
    expect(listElement).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    const imageElement = screen.getAllByRole('img');
    expect(listItems).toHaveLength(2);
  })
  it('textDataType string Array 1', () => {
    render(textDataType("string", ["a"]));
    const listElement = screen.getByRole('list'); //ul
    expect(listElement).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
  })
  it('textDataType string Array 2', () => {
    render(textDataType("string", ["a", "b"]));
    const listElement = screen.getByRole('list'); //ul
    expect(listElement).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  })
})