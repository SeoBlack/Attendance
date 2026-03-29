import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import "./src/i18n";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
